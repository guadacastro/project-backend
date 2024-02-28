const { Cart } = require('../models');

const cartController = {
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
      const cart = await Cart.findById(req.params.cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener carrito por ID' });
    }
  },

  // Método para agregar un producto al carrito
  addProductToCart: async (req, res) => {
    try {
      const { cartId, productId } = req.params;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      // Lógica para agregar un producto al carrito
      // Esto dependerá de cómo esté estructurada tu base de datos y modelo de datos
      // Aquí, por simplicidad, supondré que hay un array de productos en el carrito
      // y simplemente agregaremos el productId al array de productos

      cart.products.push(productId); // Agregar el productId al array de productos
      await cart.save(); // Guardar el carrito actualizado en la base de datos

      res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
  },

  
};

module.exports = cartController;
