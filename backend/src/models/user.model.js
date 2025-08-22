const pool = require('../config');

class User {
  static async create({ email, password }) {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const [result] = await pool.query(sql, [email, password]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  }
}

module.exports = User;