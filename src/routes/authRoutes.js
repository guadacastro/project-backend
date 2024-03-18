const express = require('express');
const passport = require('passport');

const router = express.Router();

// Esta ruta sirve la vista login
router.get('/login', (req, res) => {
  res.render('login');
});

// Actualización: esta ruta utiliza Passport para manejar el login
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',  // Redirecciona aquí en caso de éxito
  failureRedirect: '/login',  // Redirecciona aquí si falla el login
  failureFlash: true  
}));

// Esta ruta sirve la vista register
router.get('/register', (req, res) => {
  res.render('register');
});

// Actualización: esta ruta utiliza Passport para el registro de usuarios
router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/login',  // Redirecciona aquí para que el usuario inicie sesión después del registro
  failureRedirect: '/register',  // Redirecciona aquí si falla el registro
  failureFlash: true  // P
}));

// Ruta para GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));  // Solicita el email del usuario

// Ruta de callback para GitHub después de la autenticación
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'  // Redirecciona aquí si falla la autenticación con GitHub
}), (req, res) => {
  res.redirect('/profile');  // Redirecciona al perfil después de una autenticación exitosa
});

// Esta ruta maneja el logout
router.get('/logout', function(req, res) {
    req.logout();  // Método de Passport para terminar una sesión de login
    res.redirect('/');
  });

module.exports = router;