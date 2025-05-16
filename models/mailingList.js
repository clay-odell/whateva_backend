
const pool = require("../db");
const { BadRequestError } = require("../expressError");

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
  
    query += " ORDER BY email ASC"; // Sorted alphabetically for better retrieval
  
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
      return result.rows.map(row => row.email); // Extracting only the email addresses
    } catch (err) {
      throw new Error(`Database query error: ${err.message}`);
    }
  }
  
}

module.exports = new MailingList(pool);
