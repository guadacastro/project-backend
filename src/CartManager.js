const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  generateUniqueId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map(cart => cart.id));
    return maxId + 1;
  }

  createCart() {
    const newCart = {
      id: this.generateUniqueId(),
      products: []
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(cartId) {
    const cart = this.carts.find(c => c.id === parseInt(cartId, 10));
    return cart || null;
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado.');
    }

    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    this.saveCarts();
  }
}

module.exports = CartManager;
