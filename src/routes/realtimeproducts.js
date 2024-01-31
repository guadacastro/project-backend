
const express = require('express');
const router = express.Router();

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realtimeproducts', { products });
});

module.exports = router;
