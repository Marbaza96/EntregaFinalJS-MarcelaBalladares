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
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

// RENDERIZAR PRODUCTOS DEL CARRITO
function renderCarrito() {
    cartSection.innerHTML = "";

    // SI EL CARRITO ESTA VACIO
    if (!carrito[0]) {
        cartSection.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
        cartTotal.innerText = "0";

        // SI NO HAY PRODUCTOS: BTN "CONTINUAR CON LA COMPRA" INHABILITADO
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

// BOTON SUMAR CANTIDAD EN CARRITO
function activarBtnSumar() {
    const botonesSumar = document.querySelectorAll(".btn-sumar");

    botonesSumar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));
            const productoEncontrado = carrito.find(producto => producto.id === idProducto);

            if (productoEncontrado) {
                productoEncontrado.cantidad++;
            }

            guardarCarrito();
            renderCarrito();
        });
    });
}

// BOTON RESTAR CANTIDAD EN CARRITO
function activarBtnRestar() {
    const botonesRestar = document.querySelectorAll(".btn-restar");

    botonesRestar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.getAttribute("data-id"));
            const productoEncontrado = carrito.find(producto => producto.id === idProducto);

            if (productoEncontrado && productoEncontrado.cantidad > 1) {
                productoEncontrado.cantidad--;
            }

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

// RECALCULAR COSTO DE ENVIO AL CAMBIAR EL DEPARTAMENTO
function activarEnvioCheckout() {
    shippingDepto.addEventListener("change", () => {
        renderCheckout();
    });
}

// CALCULAR CANTIDAD TOTAL DE PRODUCTOS EN EL CARRITO PARA MOSTRAR EN RECIBO
function calcularCantidadProductos() {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

// CONFIRMACION DE LA COMPRA

// REVISAR SI TODOS LOS CAMPOS REQUIRED ESTAN COMPLETOS
function revisarFormularioCheckout() {
    const camposObligatorios = document.querySelectorAll("#checkout-form [required]");
    let formularioCompleto = true;

    camposObligatorios.forEach(campo => {
        const datoCampo = campo.value.trim();

        if (datoCampo === "") {
            formularioCompleto = false;
        }
    });

    btnPagar.disabled = !formularioCompleto;
}

// ACTIVAR REVISION DEL FORMULARIO
function activarRevisionFormulario() {
    const camposObligatorios = document.querySelectorAll("#checkout-form [required]");

    camposObligatorios.forEach(campo => {
        campo.addEventListener("input", revisarFormularioCheckout);
        campo.addEventListener("change", revisarFormularioCheckout);
    });

    revisarFormularioCheckout();
}

// BOTON CONFIRMAR COMPRA
function activarBotonCompra() {
    btnPagar.addEventListener("click", () => {

        //EL BTN ESTÁ INHABILITADO HASTA QUE LOS CAMPOS "REQUIRED" SE COMPLETEN
        if (btnPagar.disabled) {
            return;
        }

        const subtotal = calcularTotal();
        const envio = calcularEnvio();
        const totalFinal = subtotal + envio;

        Swal.fire({
            title: "¿Confirmar la compra?",
            text: `Total final: $${totalFinal} UYU`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const cantidadProductos = calcularCantidadProductos();

                carrito = [];
                guardarCarrito();
                renderCheckout();
                revisarFormularioCheckout();

                Swal.fire({
                    title: "¡Compra realizada con éxito!",
                    html: `
                        <p>Productos: ${cantidadProductos}</p>
                        <p>Envío: $${envio} UYU</p>
                        <p>Total abonado: $${totalFinal} UYU</p>`,
                    icon: "success",
                    confirmButtonText: "Volver al inicio"
                }).then(() => {
                    window.location.href = "../index.html";
                });
            }
        });
    });
}

// LLAMADOS FINALES SEGUN PAGINA: CARRITO O CHECKOUT
if (mainCart) {
    activarBtnVaciar();
    renderCarrito();
}

if (mainCheckout) {
    activarEnvioCheckout();
    renderCheckout();
    activarRevisionFormulario();
    activarBotonCompra();
}

