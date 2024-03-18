const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; 
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
  callbackURL: "http://localhost:8080/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ 'githubId': profile.id });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        githubId: profile.id,
        name: profile.displayName
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

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
