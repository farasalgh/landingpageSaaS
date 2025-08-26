const Order = require("../models/order.model");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { customerName, shippingAddress, phoneNumber, totalPrice, items } =
      req.body;

    if (!customerName || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: "Data pesanan tidak lengkap." });
    }

    const orderData = {
      userId,
      customerName,
      shippingAddress,
      phoneNumber,
      totalPrice,
    };
    const newOrderId = await Order.create(orderData, items);

    res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat!", orderId: newOrderId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan internal pada server." });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const success = await Order.updateStatus(req.params.id, status);
    if (success) {
      res
        .status(200)
        .json({ message: `Status pesanan berhasil diubah menjadi ${status}` });
    } else {
      res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const success = await Order.delete(req.params.id);
    if (success) {
      res.status(200).json({ message: "Pesanan berhasil dihapus!" });
    } else {
      res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}; 

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.userId;

    const orders = await Order.findByUserId(userId);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error saat mengambil pesanan pengguna:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};