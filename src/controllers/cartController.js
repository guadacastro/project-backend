const { Cart, Product } = require('../models');
const mongoose = require('mongoose')
const cartController = {

    getAllCarts: async (req, res) => {
        try {
            const carts = await Cart.find();
            res.json(carts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los carritos' });
        }

    },
    
    
  createCart: async (req, res) => {
    try {
      const cart = await Cart.create({ products: [] });
      res.status(201).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear carrito' });
    }
  },

  getCartById: async (req, res) => {
    try {
      // Obtener el ID del carrito desde los parámetros de la solicitud
      const cartId = req.params.cartId;
  
      // Buscar el carrito por su ID
      const cart = await Cart.findById(cartId);
  
      // Verificar si no se encontró el carrito
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Obtener los detalles de los productos relacionados con el carrito
      const products = [];
      for (const [productId, product] of cart.products.entries()) {
        // Buscar el producto por su ID
        const productDetails = await Product.findById(productId);
        // Agregar el producto con sus detalles al array de productos
        products.push({
          quantity: product.quantity,
          details: productDetails
        });
      }
  
      // Devolver la información del carrito con los detalles de los productos
      res.json({ _id: cart._id, products: products, __v: cart.__v });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener carrito por ID' });
    }
  },

  // Método para agregar un producto al carrito
  
  addProductToCart: async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Buscar el carrito por su ID
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Buscar el producto en el carrito
        if (cart.products.has(productId)) {
            const existingProduct = cart.products.get(productId);
            existingProduct.quantity++;
        } else {
            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            cart.products.set(productId, { quantity: 1, details: productDetails });
        }

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
}

  
};

module.exports = cartController;