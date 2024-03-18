const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const PORT = 8080;

const session = require('express-session');
const passport = require('./configs/passport'); 
const flash = require('connect-flash');

const authRoutes = require('./routes/authRoutes.js');
const User = require('./models/user');
const profileController = require('./controllers/profileController'); // Aquí importas el controlador del perfil

// Configuración de la sesión
app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: false
}));

// Inicialización de Passport y configuración de las sesiones
app.use(passport.initialize());
app.use(passport.session());

// Habilita mensajes flash
app.use(flash());

// Habilita la recepción de datos a través de formularios
app.use(express.urlencoded({ extended: false }));

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
app.set('views', path.join(__dirname, 'views'));

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Agregar datos de usuario
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
      res.locals.userId = user._id;
      res.locals.email = user.email;
      res.locals.isAdmin = req.session.isAdmin;
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
  next();
});

//Rutas de autenticación
app.use('/', authRoutes);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/'); // Redirigir a la página principal si ya está logueado
  }

  next();
}

// Usar el middleware
app.get('/login', checkNotAuthenticated, (req, res) => res.render('login'));
app.get('/register', checkNotAuthenticated, (req, res) => res.render('register'));
app.get('/profile', checkAuthenticated, profileController.showProfile);
// Configuración de Socket.IO
const server = http.createServer(app);
const io = socketIO(server);
app.set('socketio', io);

// Definir las rutas
const productRoutes = require('./routes/productRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');

//Usar las rutas
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

app.get('/', function (req, res) {
  res.redirect('/login');
});

// Manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});