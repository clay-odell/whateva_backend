const pool = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class MailingList {
  constructor(pool) {
    this.pool = pool;
  }

  async subscribe(email) {
    if (!email) {
      throw new BadRequestError("Email is required");
    }
    
    const query = `
      INSERT INTO mailing_list (email)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [email];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database insertion error: ${err.message}`);
    }
  }

  async getSubscriptions({ email, limit, offset } = {}) {
    let query = "SELECT email FROM mailing_list";
    const values = [];
    const conditions = [];
  
    if (email) {
      conditions.push("email = $1");
      values.push(email);
    }
  
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
  
    query += " ORDER BY email ASC";
  
    if (limit) {
      values.push(limit);
      query += ` LIMIT $${values.length}`;
    }
  
    if (offset) {
      values.push(offset);
      query += ` OFFSET $${values.length}`;
    }
  
    try {
      const result = await this.pool.query(query, values);
      return result.rows.map(row => row.email);
    } catch (err) {
      throw new Error(`Database query error: ${err.message}`);
    }
  }

  async deleteSubscription(email) {
    if (!email) {
      throw new BadRequestError("Email is required");
    }

    const query = `
      DELETE FROM mailing_list
      WHERE email = $1
      RETURNING email;
    `;
    const values = [email];

    try {
      const result = await this.pool.query(query, values);

      if (result.rowCount === 0) {
        throw new NotFoundError(`No subscription found for ${email}`);
      }

      return { message: `Subscription for ${email} deleted.` };
    } catch (err) {
      throw new Error(`Database deletion error: ${err.message}`);
    }
  }
}

module.exports = new MailingList(pool);
