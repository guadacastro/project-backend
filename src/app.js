const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const passport = require('./configs/passport'); 
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes.js');
const User = require('./models/user');
const profileController = require('./controllers/profileController'); 

const app = express();
const PORT = 8080;

// Conexión a la base de datos MongoDB con Mongoose
mongoose.connect('mongodb+srv://guadycasmar123:Frat1029@codercluster.wtvepfl.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de la sesión
app.use(session({
  secret: '12345', 
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
app.use(express.json());

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para pasar datos del usuario a las vistas
app.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

// Pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Usado para errores de Passport
  next();
});

//Rutas de autenticación
app.use('/', authRoutes);

// Middleware para verificar autenticación
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

app.get('/login', checkNotAuthenticated, (req, res) => res.render('login'));
app.get('/register', checkNotAuthenticated, (req, res) => res.render('register'));
app.get('/profile', checkAuthenticated, profileController.showProfile);

// Configuración de Socket.IO
const server = http.createServer(app);
const io = socketIO(server);
app.set('socketio', io);

// Definir las rutas adicionales
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