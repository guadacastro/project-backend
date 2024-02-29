const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getAllCarts);
router.post('/create', cartController.createCart);
router.get('/:cartId', cartController.getCartById);
router.post('/:cartId/product/:productId', cartController.addProductToCart);

// Nuevos endpoints
router.delete('/:cartId/product/:productId', cartController.removeProductFromCart);
router.put('/:cartId', cartController.updateCart);
router.put('/:cartId/product/:productId', cartController.updateProductQuantity);
router.delete('/:cartId', cartController.deleteCart);

module.exports = router;
