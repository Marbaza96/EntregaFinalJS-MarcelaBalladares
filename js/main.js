

//MAIN = INDEX = HOME

//CONTENEDOR DE PRODUCTOS
const productsContainer = document.getElementById("products-container")

// RUTA DEL JSON
const URL = "./db/data.json"

//TRAER CARRITO GUARDADO EN LOCALSTORAGE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCION OBTENER PRODUCTOS DEL JSON
function obtenerProductos() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            renderProductos(data)
            activarBtnAgregar(data);
        })
        .catch(err => console.log("Ha ocurrido un error", err))
        .finally(() => console.log("Finaliza la petición"))
}

//RENDER DE PRODUCTOS EN EL HOME
function renderProductos(listaProductos) {
    productsContainer.innerHTML = "";

    listaProductos.forEach(producto => {
        const card = document.createElement("div")

        //CLASE AL "DIV" CONTENEDOR DE LAS CARDS
        card.className = "product-card";

        card.innerHTML = `<h2>ID: ${producto.id}</h2>
                          <h3>Nombre: ${producto.nombre}</h3> 
                          <h4>Precio: ${producto.precio}</h4>
                          <img src="${producto.img}" alt="${producto.nombre}">
                          <p>Info: ${producto.info}</p>
                          <button class="btn-add" data-id="${producto.id}">Agregar al carrito</button>`;
        productsContainer.appendChild(card)
    })
}

//BOTONES DE "AGREGAR AL CARRITO" - ACCION AL HACER CLICK EN C/BTN
function activarBtnAgregar(listaProductos) {
    const botonesAgregar = document.querySelectorAll(".btn-add");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));
            const productoEncontrado = listaProductos.find(producto => producto.id === idProducto);

            //LLAMADA A LA FUNCION AGREGAR AL CARRITO 
            agregarAlCarrito(productoEncontrado);
        });
    });
}

//AGREGAR PRODUCTO AL CARRITO
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(productoCarrito => productoCarrito.id === producto.id);
    //SUMO CANTIDAD SI EL PRODUCTO YA SE AGREGO AL CARRITO PREVIAMENTE 
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre:producto.nombre,
            precio: producto.precio,
            img: producto.img,
            info: producto.info,
            cantidad: 1
        });
    }
    //LLAMO A FUNCIÓN PARA GUARDAR CARRITO EN LOCALSTORAGE
    guardarCarrito();
}

//GUARDAR CARRITO EN LOCALSTORAGE
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//LLAMO A FUNCIÓN PARA OBTENER LOS PRODUCTOS
obtenerProductos()
