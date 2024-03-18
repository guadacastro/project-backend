const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; // Asegúrate de tener passport-github2 instalado
const mongoose = require('mongoose');
const User = require('../models/user');

// Estrategia local para registro
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // Permite pasar toda la solicitud a la callback
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return done(null, false, { message: 'Email already in use.' });
    }

    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: email,
      age: req.body.age,
      password: password // Será hasheado en el método pre 'save'
    });

    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia local para login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia para GitHub
passport.use(new GitHubStrategy({
  clientID: "TU_CLIENT_ID_DE_GITHUB",
  clientSecret: "TU_SECRET_DE_GITHUB",
  callbackURL: "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Aquí puedes manejar la creación o búsqueda del usuario basado en la información de GitHub
    const user = await User.findOne({ 'githubId': profile.id });
    if (user) {
      return done(null, user);
    } else {
      // Suponiendo que tu modelo User pueda manejar usuarios de GitHub
      const newUser = new User({
        // Ajusta según tu esquema de User
        githubId: profile.id,
        name: profile.displayName
        // Puedes agregar más campos que desees guardar, basados en la información proveída por GitHub
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err);
  }
}));

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;