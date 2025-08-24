const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.js');
const adminAuthMiddleware = require('../middlewares/adminAuth.js');

router.post('/', authMiddleware, orderController.placeOrder);

// Admin Only
router.get('/', [authMiddleware, adminAuthMiddleware], orderController.getAllOrders);
router.get('/:id', [authMiddleware, adminAuthMiddleware], orderController.getOrderById);
router.put('/:id/status', [authMiddleware, adminAuthMiddleware], orderController.updateOrderStatus);
router.delete('/:id', [authMiddleware, adminAuthMiddleware], orderController.deleteOrder);

module.exports = router;