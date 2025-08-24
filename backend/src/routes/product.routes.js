const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.js');
const adminAuthMiddleware = require('../middlewares/adminAuth.js');

router.get('/', productController.getAllProducts);
router.post('/', [authMiddleware, adminAuthMiddleware], productController.createProduct);
router.put('/:id', [authMiddleware, adminAuthMiddleware], productController.updateProduct);
router.delete('/:id', [authMiddleware, adminAuthMiddleware], productController.deleteProduct);

module.exports = router;