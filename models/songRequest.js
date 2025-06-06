const pool = require("../db");
const { BadRequestError } = require("../expressError");

class SongRequestForm {
    constructor(pool) {
        this.pool = pool;
    }

    async createRequest(requestData) {
        const { name, songTitle, artist, albumOrVersion, reason } = requestData;

        if (!name || !songTitle || !artist || !reason) {
            throw new BadRequestError("Missing required fields");
        }

        const query = `
            INSERT INTO song_requests (name, song_title, artist, album_or_version, reason)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [name, songTitle, artist, albumOrVersion || null, reason];

        try {
            const result = await this.pool.query(query, values);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Database insertion error: ${err.message}`);
        }
    }

    async getRequests() {
        const query = "SELECT * FROM song_requests ORDER BY id DESC;";
        try {
          const result = await this.pool.query(query);
          return result.rows;
        } catch (err) {
          throw new Error(`Database query error: ${err.message}`);
        }
      }

    async deleteRequest(id) {
        try {
            const result = await this.pool.query(
                "DELETE FROM song_requests WHERE id = $1 RETURNING *",
                [id]
            );
            return result.rows[0];
        } catch (err) {
            throw new Error(`Database deletion error: ${err.message}`);
        }
    }
}

// Export an instance of SongRequestForm
module.exports = new SongRequestForm(pool);
