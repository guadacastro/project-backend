const express = require('express');
const { loginHandler, registerHandler } = require('../controllers/authController');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', loginHandler);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', registerHandler);

router.get('/logout', function(req, res, next) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

module.exports = router;