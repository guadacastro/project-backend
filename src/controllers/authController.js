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
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        req.flash('error_msg', 'El email ya está registrado.');
        return res.redirect('/register');
        }

        const user = new User({ first_name, last_name, email, age, password });
        await user.save();

        req.session.userId = user._id;
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error durante el registro.');
        res.redirect('/register');
    }
  }
  
  module.exports = { loginHandler, registerHandler };