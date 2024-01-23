const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  generateUniqueId() {
    if (this.products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.products.map(product => product.id));
    return maxId + 1;
  }

  addProduct(product) {
    try {
      let thumbnails = product.thumbnails;
  
      if (typeof thumbnails === 'string') {
        try {
          thumbnails = JSON.parse(thumbnails);
        } catch (error) {
          console.error("Error al parsear thumbnails:", error);
          throw new Error("Formato inválido para thumbnails.");
        }
      }
  
      const newProduct = {
        id: this.generateUniqueId(),
        ...product,
        thumbnails
      };
  
      this.products.push(newProduct);
      this.saveProducts();
      console.log("Producto agregado correctamente:", newProduct);
      return newProduct;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw new Error("Error al agregar producto.");
    }
  }  

  getProducts() {
    this.loadProducts();
    return this.products;
  }

  getProductById(productId) {
    this.loadProducts();
    const product = this.products.find((p) => p.id === parseInt(productId, 10));
  
    if (product) {
      return product;
    } else {
      throw new Error("Producto no encontrado.");
    }
  }

  updateProduct(productId, updatedFields) {
    this.loadProducts();
    console.log('updatedFields', updatedFields);
    const productIndex = this.products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields, id: productId };
      this.saveProducts();
      console.log("Producto actualizado correctamente:", this.products[productIndex]);
    } else {
      console.error("Producto no encontrado. No se puede actualizar.");
    }
  }

  deleteProduct(productId) {
    this.loadProducts();
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== productId);

    if (this.products.length < initialLength) {
      this.saveProducts();
      console.log("Producto eliminado correctamente.");
    } else {
      console.error("Producto no encontrado. No se puede eliminar.");
    }
  }
}

const productManager = new ProductManager('productos.json');
module.exports = ProductManager;