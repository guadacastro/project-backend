const User = require('../models/user');
const bcrypt = require('bcrypt');

function loginHandler(req, res, next) {
  let { email, password } = req.body;
  
  User.findOne({ email: email }, function (err, user) {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/login');
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result == true) {
        req.session.userId = user._id;
        req.session.isAdmin = email === 'adminCoder@coder.com';
        res.redirect('/products');
      } else {
        res.redirect('/login');
      }
    });
  });
}

function registerHandler(req, res, next) {
  // extrae los datos del formulario de registro desde req.body
  let { email, password } = req.body;

  // crear el nuevo usuario
  let user = new User({ email, password });

  // intentar guardar el usuario en la base de datos
  user.save((err, user) => {
    if (err) {
      // si ocurrió un error, continuar al próximo middleware con el error
      next(err);
    } else {
      // si no hubo errores, iniciar sesión como el nuevo usuario e ir a productos
      req.session.userId = user._id;
      req.session.isAdmin = email === 'adminCoder@coder.com';
      res.redirect('/products');
    }
  });
}

module.exports = { loginHandler, registerHandler };