const mongoose = require('mongoose');
const fs = require('fs/promises'); // Utilizamos fs/promises para trabajar con promesas en lugar de callbacks
const Product = require('./models/product.js'); // Asegúrate de importar el modelo de Producto

// Conexión a la base de datos MongoDB con Mongoose
mongoose.connect('mongodb+srv://guadycasmar123:Frat1029@codercluster.wtvepfl.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Conexión exitosa a MongoDB');

    try {
      // Leer el archivo productos.json
      const data = await fs.readFile('productos.json', 'utf8');
      const products = JSON.parse(data);

      // Insertar los datos en la base de datos
      await Product.insertMany(products);
      console.log('Datos insertados correctamente');

      // Cerrar la conexión después de insertar los datos
      mongoose.connection.close();
    } catch (error) {
      console.error('Error al insertar datos:', error);
    }
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
