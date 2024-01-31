
const express = require('express');
const router = express.Router();

router.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

module.exports = router;
