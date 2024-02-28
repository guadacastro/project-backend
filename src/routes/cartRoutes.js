const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getAllCarts);
router.post('/create', cartController.createCart);
router.get('/:cartId', cartController.getCartById);
router.post('/:cartId/product/:productId', cartController.addProductToCart);

// Nuevos endpoints
// router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
// router.put('/:cid', cartController.updateCart);
// router.put('/:cid/products/:pid', cartController.updateProductQuantity);

module.exports = router;
