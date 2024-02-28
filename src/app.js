const express = require('express');
const exphbs  = require('express-handlebars');
const multer = require('multer');
const ProductManager = require('./ProductManager.js');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const handlebars = require('handlebars'); 
const mongoose = require('mongoose');

const app = express();
const upload = multer();
const server = http.createServer(app);
const io = socketIO(server, { path: '/socket.io' });

const productManager = new ProductManager('productos.json');
const CartManager = require('./CartManager.js');
const cartManager = new CartManager('carrito.json');

const indexRouter = require('./routes/index');
const homeRouter = require('./routes/home');
const realtimeProductsRouter = require('./routes/realtimeproducts');

const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');

// Importar los modelos de Mongoose
const Product = require('./models/Product');
const Cart = require('./models/Cart');


app.use('/', indexRouter);

// Conexión a la base de datos MongoDB con Mongoose
mongoose.connect('mongodb+srv://guadycasmar123:Frat1029@codercluster.wtvepfl.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));




// Rutas para productos y carritos
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

 

// Configuración de Handlebars
// app.engine('handlebars', exphbs({
//   defaultLayout: 'main',
//   layoutsDir: path.join(__dirname, 'views/layouts'), 
// }));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

// app.engine('handlebars', exphbs());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

//configuracion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//configuracion de socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado')
    //manejar el evento del cliente al agregar un producto
    socket.on('productoAgregado', async (producto)=>{
      try {
        const newProduct = await productManager.addProduct(producto);
        io.emit('productoAgregado', newProduct);
      } catch (error) {
        console.error(error);
        socket.emit('error', {message: 'Error al agregar el producto'});
      }
    });

    // Manejar evento del cliente al eliminar un producto
    socket.on('productoEliminado', async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        io.emit('productoEliminado', productId);
      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Error al eliminar el producto' });
      }
    });

    // Desconectar al usuario
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
});

app.use((req, res, next) => {
  req.io = io;
  next();
})

app.use('/', indexRouter);
app.use('/', homeRouter);
app.use('/', realtimeProductsRouter);



app.get('/', (req, res) => {
  res.render('index');
})
app.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realtimeproducts', { products })
})


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
const SOCKET_PORT = 3000;

server.listen(SOCKET_PORT, () => {
  console.log(`Servidor de Socket.IO corriendo en http://localhost:${SOCKET_PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor principal corriendo en http://localhost:${PORT}`);
});
