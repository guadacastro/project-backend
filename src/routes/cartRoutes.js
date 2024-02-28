const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/carts', cartController.createCart);
router.get('/carts/:cartId', cartController.getCartById);
router.post('/carts/:cartId/product/:productId', cartController.addProductToCart);
// Otros endpoints relacionados con los carritos

module.exports = router;
