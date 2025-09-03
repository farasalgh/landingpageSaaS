const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.js');
const adminAuthMiddleware = require('../middlewares/adminAuth.js');

// Rute untuk user
router.post('/', authMiddleware, orderController.placeOrder);
router.get('/myorders', authMiddleware, orderController.getUserOrders);

// ======================= PERBAIKAN URUTAN DI SINI =======================
// Rute Admin Only

// Rute SPESIFIK harus didefinisikan SEBELUM rute DINAMIS
router.get('/admin', [authMiddleware, adminAuthMiddleware], orderController.getAllOrdersAdmin);

// Rute ini mengambil semua order (versi lama, mungkin bisa dihapus jika tidak dipakai)
router.get('/', [authMiddleware, adminAuthMiddleware], orderController.getAllOrders);

// Rute DINAMIS dengan parameter :id
router.get('/:id', [authMiddleware, adminAuthMiddleware], orderController.getOrderById);
router.put('/:id/status', [authMiddleware, adminAuthMiddleware], orderController.updateOrderStatus);
router.delete('/:id', [authMiddleware, adminAuthMiddleware], orderController.deleteOrder);
// ======================================================================

module.exports = router;