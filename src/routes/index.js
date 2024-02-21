const express = require('express');
const router = express.Router();
const path = require('path');


const ProductManager = require('../ProductManager.js');


const productManager = new ProductManager('productos.json');



// Ruta para la vista home
router.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

// Ruta para la vista realTimeProducts
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});



module.exports = router;
