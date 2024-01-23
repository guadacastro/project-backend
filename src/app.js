const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer();
const ProductManager = require('./ProductManager.js');

app.use(express.json());
const productManager = new ProductManager('productos.json');
const CartManager = require('./CartManager.js');
const cartManager = new CartManager('carrito.json');



app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit, 10));
      return res.json(limitedProducts);
    }

    return res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (product) {
      return res.json(product);
    }

    return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto por ID' });
  }
});

app.post('/', upload.none(), async (req, res) => {
  try {
    console.log('req', req.body);
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newProduct = {
      id: productManager.generateUniqueId(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    // Agregamos el producto
    await productManager.addProduct(newProduct);

    // Respondemos con el producto creado
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

app.put('/products/:pid', upload.none(), async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    // Asegurarse de no actualizar el id
    if (updatedFields.id) {
      delete updatedFields.id;
    }

    await productManager.updateProduct(parseInt(pid, 10), updatedFields);
    return res.status(200).json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(parseInt(pid, 10));
    return res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.post('/api/carts/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    return res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (cart) {
      return res.json(cart.products);
    }

    return res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.addProductToCart(cid, pid);
    return res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
