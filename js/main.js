

//MAIN = INDEX = HOME

//CONTENEDOR DE PRODUCTOS
const productsContainer = document.getElementById("products-container")

// RUTA DEL JSON
const URL = "./db/data.json"

//TRAER CARRITO GUARDADO EN LOCALSTORAGE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCION ASYNC PARA OBTENER PRODUCTOS DEL JSON
function obtenerProductos() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            renderProductos(data)
            activarBtnAgregar(data);
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los productos."
            });
        })
        .finally(() => {
        });
}

//RENDER DE PRODUCTOS EN EL HOME
function renderProductos(listaProductos) {
    productsContainer.innerHTML = "";

    listaProductos.forEach(producto => {
        const card = document.createElement("div")

        //CLASE AL "DIV" CONTENEDOR DE LAS CARDS
        card.className = "product-card";

        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.info}</p>
            <div class="product-card-bottom">
                <button class="btn-add" data-id="${producto.id}">Agregar al carrito</button>
                <h4>$${producto.precio} UYU</h4>
            </div>`;

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

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.img,
            info: producto.info,
            cantidad: 1
        });
    }

    //LLAMADO A FUNCION GUARDAR CARRITO EN L.S
    guardarCarrito();

    //NOTIFICACION AL AGREGAR AL CARRITO
    Toastify({
        text: `${producto.nombre} agregado al carrito`,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: "#90c9e9",
            color: "#010711",
        }
    }).showToast();
}

//GUARDAR CARRITO EN LOCALSTORAGE
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//LLAMO A FUNCIÓN PARA OBTENER LOS PRODUCTOS
obtenerProductos()
