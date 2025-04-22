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

const productosDisponibles = [
    new Producto(1, "Ron Santa Teresa", 11990,"./Images/ron-santa-teresa-anejo.jpg"),
    new Producto(2, "Ron Santa Teresa Linaje", 15990,"./Images/RON-SANTA-TERESA-LINAJE-070.jpg"),
    new Producto(3, "Ron Cacique", 9990,"./Images/cacique-ron-venezolano.png"),
    new Producto(4, "Ron Cacique 500", 12990, "./Images/ron-cacique-500.jpg"),
    new Producto(5, "Ron Cacique Leyenda", 18990, "./Images/ron-cacique-leyenda.jpg"),
    new Producto(6, "Ron Santa Teresa 1796", 29990, "./Images/ron-solera-santa-teresa-1796.jpg"),
    new Producto(7, "Ron Moneda de Oro", 7490, "./Images/ron-moneda-de-oro.jpg"),
    new Producto(8, "Ron Carta Roja", 6490, "./Images/ron-carta-roja.jpeg"),
    new Producto(9, "Ron Carúpano Extra", 16990, "./Images/ron-carupano-extra.jpg"),
    new Producto(10, "Ron Bodega 1800", 14990, "./Images/ron-bodega-1800.png"),
];


function renderizarProductos() {
    contenedorProductos.innerHTML = "";
    productosDisponibles.forEach(prod => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio}</p>
            <img src="${prod.imagen}" alt="${prod.nombre}" width="100" height="100">
            <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const productoExistente = productos.find(p => p.id === id);
    if (productoExistente) {
        productoExistente.aumentarCantidad();
    } else {
        const producto = productosDisponibles.find(p => p.id === id);
        productos.push(new Producto(producto.id, producto.nombre, producto.precio));
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
    alert("El carrito ha sido vaciado.");
});

document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (nombreGuardado) {
        saludo.textContent = `Hola, ${nombreGuardado}!`;
    }

    renderizarProductos();
    actualizarCarrito();
});
