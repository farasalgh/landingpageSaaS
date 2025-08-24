const Order = require('../models/order.model');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { customerName, shippingAddress, phoneNumber, totalPrice, items } = req.body;

    if (!customerName || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
    }

    const orderData = { userId, customerName, shippingAddress, phoneNumber, totalPrice };
    const newOrderId = await Order.create(orderData, items);

    res.status(201).json({ message: 'Pesanan berhasil dibuat!', orderId: newOrderId });

  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan internal pada server.' });
  }
};