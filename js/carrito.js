//PAGINA CARRITO Y CHECKOUT

// CARRITO DESDE LOCALSTORAGE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// CONST DEL DOM - IDENTIFICACION DE PAGINAS
const mainCart = document.getElementById("main-cart");
const mainCheckout = document.getElementById("main-checkout");

// CONST DEL DOM - PAG. CARRITO
const cartSection = document.querySelector(".cart-section");
const cartTotal = document.getElementById("cart-total");
const btnVaciar = document.getElementById("cart-btn-empty");
const checkoutContainer = document.getElementById("checkout-container");

// GUARDAR CARRITO EN LOCALSTORAGE
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// CALCULAR TOTAL DEL CARRITO (PRECIO * CANTIDAD DE C/PRODUCTO AGREGADO)
function calcularTotal() {
    let total = 0;

    carrito.forEach(producto => {
        total = total + (producto.precio * producto.cantidad);
    });

    return total;
}

// RENDERIZAR PRODUCTOS DEL CARRITO
function renderCarrito() {
    cartSection.innerHTML = "";

    let carritoVacio = true;

    carrito.forEach(() => {
        carritoVacio = false;
    });

    // SI EL CARRITO ESTA VACIO
    if (carritoVacio) {
        cartSection.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
        cartTotal.innerText = "0";

        // BTN "CONTINUAR CON LA COMPRA" INHABILITADO
        if (checkoutContainer) {
            checkoutContainer.style.display = "none";
        }

        return;
    }

    // SI HAY PRODUCTOS EN EL CARRITO (SE HABILITA BTN PARA CONTINUAR CON LA COMPRA)
    if (checkoutContainer) {
        checkoutContainer.style.display = "block";
    }

    //SE CREA UN "ARTICLE" PARA CADA PRODUCTO AGREGADO
    carrito.forEach(producto => {
        const cartCard = document.createElement("article");
        cartCard.className = "cart-card";

        cartCard.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <h4>Precio unitario: $${producto.precio} UYU</h4>
            <p>Info: ${producto.info}</p>
            <div class="cart-controls">
                <button class="btn-restar" data-id="${producto.id}">-</button>
                <p>Cantidad: ${producto.cantidad}</p>
                <button class="btn-sumar" data-id="${producto.id}">+</button>
            </div>
            <p>Subtotal: $${producto.precio * producto.cantidad} UYU</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>`;

        cartSection.appendChild(cartCard);
    });

    cartTotal.innerText = calcularTotal();

    activarBtnSumar();
    activarBtnRestar();
    activarBtnEliminar();
}

// BOTON SUMAR
function activarBtnSumar() {
    const botonesSumar = document.querySelectorAll(".btn-sumar");

    botonesSumar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));

            carrito.forEach(producto => {
                if (producto.id === idProducto) {
                    producto.cantidad++;
                }
            });

            guardarCarrito();
            renderCarrito();
        });
    });
}

// BOTON RESTAR
function activarBtnRestar() {
    const botonesRestar = document.querySelectorAll(".btn-restar");

    botonesRestar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));

            carrito.forEach(producto => {
                if (producto.id === idProducto && producto.cantidad > 1) {
                    producto.cantidad--;
                }
            });

            guardarCarrito();
            renderCarrito();
        });
    });
}

// BOTON ELIMINAR
function activarBtnEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));

            carrito = carrito.filter(producto => producto.id !== idProducto);

            guardarCarrito();
            renderCarrito();
        });
    });
}

// BOTON VACIAR CARRITO
function activarBtnVaciar() {
    btnVaciar.addEventListener("click", () => {
        carrito = [];
        guardarCarrito();
        renderCarrito();
    });
}

//PAGINA CHECKOUT

// CONST DEL DOM - PAG. CHECKOUT
const checkoutProducts = document.getElementById("checkout-products");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutShipping = document.getElementById("checkout-shipping");
const checkoutTotal = document.getElementById("checkout-total");
const shippingDepto = document.getElementById("shipping-depto");
const btnPagar = document.getElementById("checkout-btn-pay");

//FUNCION DEL COSTO DE ENVIO (MONTEVIDEO=$0 / INTERIOR=$250)
function calcularEnvio() {
    let costoEnvio = 0;

    if (shippingDepto.value === "Interior") {
        costoEnvio = 250;
    }

    return costoEnvio;
}

//RESUMEN DEL CHECKOUT

//FUNCION PARA MOSTRAR PRODUCTOS EN EL CHECKOUT
function renderCheckout() {
    checkoutProducts.innerHTML = "";

    //RENDER DE LOS PRODUCTOS EN EL RESUMEN
    carrito.forEach(producto => {
        const checkoutCard = document.createElement("article");
        checkoutCard.className = "checkout-card";

        checkoutCard.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subtotal: $${producto.precio * producto.cantidad} UYU</p>`;

        checkoutProducts.appendChild(checkoutCard);
    });

    //USO DE FUNCIONES PARA CALCULO DE SUBTOTAL, ENVIO Y TOTAL EN RESUMEN
    const subtotal = calcularTotal();
    const envio = calcularEnvio();
    const totalFinal = subtotal + envio;

    checkoutSubtotal.innerText = subtotal;
    checkoutShipping.innerText = envio;
    checkoutTotal.innerText = totalFinal;
}

// EVENTO "CHANGE" EN EL SELECT DEL DEPARTAMENTO
function activarEnvioCheckout() {
    shippingDepto.addEventListener("change", () => {
        renderCheckout();
    });
}

//CONFIRMACION DE LA COMPRA
function activarBotonCompra() {
    //EVENTO "CLICK" EN CONFIRMAR LA COMPRA
    const checkoutForm = document.getElementById("checkout-form");

    checkoutForm.addEventListener("submit", (evento) => {

        evento.preventDefault();

        const subtotal = calcularTotal();
        const envio = calcularEnvio();
        const totalFinal = subtotal + envio;

        //CONFIRMACION CON ALERTA 
        Swal.fire({
            title: "¿Confirmar la compra?",
            text: `Total final: $${totalFinal} UYU`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                guardarCarrito();
                renderCheckout();

                Swal.fire({
                    title: "¡Compra realizada con éxito!",
                    icon: "success",
                    confirmButtonText: "Volver al inicio"
                }).then(() => {
                    window.location.href = "../index.html";
                });
            }
        });
    });
}

// LLAMADOS FINALES SEGUN PAGINA
if (mainCart) {
    activarBtnVaciar();
    renderCarrito();
}

if (mainCheckout) {
    activarEnvioCheckout();
    renderCheckout();
    activarBotonCompra();
}


