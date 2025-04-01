
let articulos = [];
let total = 0;

let edad = parseInt(prompt("Ingrese su edad:"))

if (edad >= 18) {
    console.log("Puede comprar los articulos");
 
    for (let i = 0; i < 2; i++) {
        agregarArticulos();
    }

    mostrararticulos();


  
}
else {
  console.log("No puede comprar los articulos");
}
  


function agregarArticulos() {
  let nombre = prompt("Ingrese nombre del articulo:");
  let precio = prompt("Ingrese precio del articulo:");
  articulos.push({ nombre: nombre, precio: parseInt(precio) });
  total += parseInt(precio);
}


function mostrararticulos() {
  console.log("articulos:");
  for (let i = 0; i < articulos.length; i++) {
    console.log(`${i + 1}. ${articulos[i].nombre} - $${articulos[i].precio}`);
  }
  console.log(`Total: $${total}`);
}

