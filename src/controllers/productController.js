const { Product } = require('../models');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      // Parámetros de paginación
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // Número predeterminado de elementos por página
      
      // Parámetros de ordenamiento
      const sort = req.query.sort || null;

      // Parámetros de filtro por categoría
      const category = req.query.query || null;

      // Calcular el índice de inicio
      const startIndex = (page - 1) * limit;

      // Consulta base
      let query = Product.find();

      // Aplicar filtro por categoría si se proporciona
      if (category) {
        query = query.where('category').equals(category);
      }

      // Aplicar ordenamiento si se proporciona
      if (sort) {
        if (sort === 'asc') {
          query = query.sort({ price: 1, sotck: 1 });
        } else if (sort === 'desc') {
          query = query.sort({ price: -1, stock: -1 });
        }
      }

      // Obtener el total de productos
      const totalProducts = await Product.countDocuments();

      // Calcular el total de páginas
      const totalPages = Math.ceil(totalProducts / limit);

      // Obtener productos según la paginación, el ordenamiento y el filtro por categoría
      const products = await query.limit(limit).skip(startIndex);

      // Construir la respuesta
      const response = {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page - 1}&limit=${limit}&sort=${sort}&query=${category}` : null,
        nextLink: page < totalPages ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}&sort=${sort}&query=${category}` : null
      };

      res.render('products', { products: response.payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", error: 'Error al obtener productos' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ status: "error", error: 'Producto no encontrado' });
      }
      res.render('products', { products: response.payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", error: 'Error al obtener producto por ID' });
    }
  },
};

module.exports = productController;
