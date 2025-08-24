const pool = require('../config');

class Product {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
        return rows;
    }

    static async create(productData) {
        const { name, description, price, image_url, stock } = productData;
        const sql = 'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [name, description, price, image_url, stock]);
        return result.insertId;
    }

    static async update(id, productData) {
        const { name, description, price, image_url, stock } = productData;
        const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?';
        const [result] = await pool.query(sql, [name, description, price, image_url, stock, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
module.exports = Product;