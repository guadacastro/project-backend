const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function(next) {
  let user = this;
  
  if (!user.isModified('password')) return next();
  
  bcrypt.hash(user.password, 10).then(hashedPassword => {
    user.password = hashedPassword;
    next();
  }).catch(err => next(err));
});

module.exports = mongoose.model('User', UserSchema);