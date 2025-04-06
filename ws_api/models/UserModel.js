import { pool } from "../db/db_init.js";

export const UserModel = {
  async findByEmail(email) {
    const result = await pool.query("SELECT id, username, email FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  },

  async findByEmailWithPassword(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  },

  async create({ username, email, hashed_password }) {
    const result = await pool.query("INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, username, email", [username, email, hashed_password]);
    return result.rows[0];
  },
};
