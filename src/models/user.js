const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mantener el esquema original e incorporar funcionalidades requeridas
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hasheo de contraseña antes de guardar si la contraseña fue modificada
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // La contraseña es hasheada con un coste de complejidad de 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar la contraseña ingresada con la almacenada (hasheada)
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Exporta el modelo de Mongoose
module.exports = mongoose.model('User', userSchema);