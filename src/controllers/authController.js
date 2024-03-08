const bcrypt = require('bcrypt');
const User = require('../models/user'); 

async function loginHandler(req, res, next) {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.redirect('/login');
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user._id;
        req.session.isAdmin = email === 'adminCoder@coder.com';
        res.redirect('/products');
      } else {
        res.redirect('/login');
      }
    } catch (err) {
      next(err);
    }
  }
  

  async function registerHandler(req, res, next) {
    const { email, password } = req.body;
  
    try {
      // Verificar si el correo electrónico ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Manejar el caso en que el usuario ya exista
        return res.redirect('/register'); // O enviar un mensaje de error
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear el nuevo usuario y guardarlo en la base de datos
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      // Realizar otras acciones como iniciar sesión al usuario
      req.session.userId = newUser._id;
      return res.redirect('/products'); // Redirigir a la página de productos o al inicio de sesión
  
    } catch (err) {
      next(err);
    }
  }
  
  module.exports = { loginHandler, registerHandler };