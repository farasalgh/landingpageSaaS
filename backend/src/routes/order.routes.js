const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.js');

router.post('/', authMiddleware, orderController.placeOrder);

module.exports = router;