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
}

module.exports = Order;