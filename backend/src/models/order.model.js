const pool = require('../config');

class Order {
  static async create(orderData, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const orderSql = 'INSERT INTO orders (user_id, customer_name, shipping_address, phone_number, total_price) VALUES (?, ?, ?, ?, ?)';
      const [orderResult] = await connection.query(orderSql, [
        orderData.userId,
        orderData.customerName,
        orderData.shippingAddress,
        orderData.phoneNumber,
        orderData.totalPrice
      ]);
      const orderId = orderResult.insertId;

      const itemSql = 'INSERT INTO order_items (order_id, product_name, quantity, price_per_item) VALUES ?';
      const itemValues = items.map(item => [orderId, item.name, item.quantity, item.price]);
      await connection.query(itemSql, [itemValues]);

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll() {
    const sql = 'SELECT * FROM orders ORDER BY order_date DESC';
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async findById(orderId) {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orderRows.length === 0) return null;

    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    
    const order = orderRows[0];
    order.items = itemRows;
    return order;
  }

  static async updateStatus(orderId, status) {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await pool.query(sql, [status, orderId]);
    return result.affectedRows > 0;
  }

  static async delete(orderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
      const [orderResult] = await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);
      await connection.commit();
      return orderResult.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByUserId(userId) {
    const ordersSql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';
    const [orders] = await pool.query(ordersSql, [userId]);

    for (const order of orders) {
      const itemsSql = 'SELECT product_name, quantity, price_per_item FROM order_items WHERE order_id = ?';
      const [items] = await pool.query(itemsSql, [order.id]);
      order.items = items;
    }

    return orders;
  }
  
}

module.exports = Order;