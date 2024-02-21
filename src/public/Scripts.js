
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const formulario = document.getElementById('agregarProductoForm');
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();
  

      const datosProducto = {
        // Obtener datos del formulario, por ejemplo:
        // title: document.getElementById('titleInput').value,
        // description: document.getElementById('descriptionInput').value,

  
        
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value, 10),
        category: document.getElementById('category').value,
        thumbnails: document.getElementById('thumbnails').value.split(','),
      };
  
 
      socket.emit('productoAgregado', datosProducto);
    });
  

    socket.on('productoAgregado', (producto) => {
   
      console.log('Producto agregado:', producto);
   
    });
  });
  