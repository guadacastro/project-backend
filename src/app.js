const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const PORT = 8080;

// Conexión a la base de datos MongoDB con Mongoose
mongoose.connect('mongodb+srv://guadycasmar123:Frat1029@codercluster.wtvepfl.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Socket.IO
const server = http.createServer(app);
const io = socketIO(server);
app.set('socketio', io);

// Definir las rutas
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');

// Usar las rutas
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

// Manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
