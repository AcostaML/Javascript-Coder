const saludo = document.getElementById("saludo");
const total = document.getElementById("total");
const botonVaciar = document.getElementById("vaciarCarrito");
const contenedorProductos = document.getElementById("productos");

let productos = JSON.parse(localStorage.getItem("carrito")) || [];

class Producto {
    constructor(id, nombre, precio,imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
        this.subtotal = this.precio;
    }

    aumentarCantidad() {
        this.cantidad++;
        this.subtotal = this.precio * this.cantidad;
    }
}

let productosDisponibles = [];



fetch('./productos.json')
    .then(response => response.json())
    .then(data => {
        productosDisponibles = data.map(prod => new Producto(prod.id, prod.nombre, prod.precio, prod.imagen));
        renderizarProductos(); 
    })
    .catch(error => console.error('Error al cargar productos:', error));



function renderizarProductos() {
    contenedorProductos.innerHTML = "";
    productosDisponibles.forEach(prod => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio}</p>
            <img src="${prod.imagen}" alt="${prod.nombre}" width="100" height="100">
            <br>
            <label for="cantidad-${prod.id}">Cantidad:</label>
            <input type="number" id="cantidad-${prod.id}" value="1" min="1" style="width: 50px;">
            <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        `;

        contenedorProductos.appendChild(div);
    });
}

function agregarAlCarrito(id) {

    const cantidadInput = document.getElementById(`cantidad-${id}`);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad inválida',
            text: 'Por favor, ingresa una cantidad válida.'
        });
        return;
    }

    const productoExistente = productos.find(p => p.id === id);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
    } else {
        const producto = productosDisponibles.find(p => p.id === id);
        const nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.imagen);
        nuevoProducto.cantidad = cantidad;
        nuevoProducto.subtotal = nuevoProducto.precio * cantidad;
        productos.push(nuevoProducto);
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(productos));
    let totalCompra = productos.reduce((acc, p) => acc + p.subtotal, 0);
    total.textContent = `El total de la compra es: $${totalCompra}`;
}

botonVaciar.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    productos = [];
    total.textContent = "El total de la compra es: $0";
    Swal.fire({
    icon: 'info',
    title: 'Carrito Vacío',
    text: 'El carrito ha sido vaciado exitosamente.'
});

});

document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (nombreGuardado) {
        saludo.textContent = `Hola, ${nombreGuardado}!`;
    }

    renderizarProductos();
    actualizarCarrito();
});

const formularioCompra = document.getElementById("formularioCompra");

formularioCompra.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreCliente").value;
    const email = document.getElementById("emailCliente").value;

    if (productos.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de finalizar la compra.'
        });
        return;
    }

    
    let resumen = `<u>Detalle de la compra:</u><br><br>`;
    productos.forEach(prod => {
        resumen += `- ${prod.nombre} x${prod.cantidad}: $${prod.subtotal}<br>`;
    });
    resumen += `<br><strong>Total: $${productos.reduce((acc, p) => acc + p.subtotal, 0)}</strong>`;

    
    Swal.fire({
        icon: 'info',
        title: 'Confirma tu compra',
        html: resumen,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Compra',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            
            Swal.fire({
                icon: 'success',
                title: 'Compra Realizada',
                text: `Gracias por tu compra, ${nombre}!`
            });

            
            localStorage.setItem("ultimaCompra", JSON.stringify({ nombre, email, productos }));

            
            productos = [];
            localStorage.removeItem("carrito");
            actualizarCarrito();
        }
    });
});

    
    let resumen = `<strong>Gracias por tu compra, ${nombre}!</strong><br><br><u>Productos adquiridos:</u><br>`;
    productos.forEach(prod => {
        resumen += `- ${prod.nombre} x${prod.cantidad}: $${prod.subtotal}<br>`;
    });
    resumen += `<br><strong>Total: $${calcularTotal()}</strong>`;

    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        html: resumen
    });

    
    localStorage.setItem("ultimaCompra", JSON.stringify({ nombre, email, productos }));

    
    productos = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();


