const express = require('express');
const router = express.Router();
const path = require('path');

// Importa tu ProductManager y otras clases si es necesario
const ProductManager = require('../ProductManager.js');

// Configura tu ProductManager
const productManager = new ProductManager('productos.json');

// Define las rutas

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

// Puedes agregar más rutas según tus necesidades

module.exports = router;
