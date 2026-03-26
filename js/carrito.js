
//PAGINA CARRITO Y CHECKOUT

// CARRITO DESDE LOCALSTORAGE
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// CONST DEL DOM - IDENTIFICACION POR PAGINAS: CARRITO O CHECKOUT
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

        //CLASE PARA CARDS EN CARRITO
        cartCard.className = "cart-card";

        cartCard.innerHTML = `
            <img src="../${producto.img}" alt="${producto.nombre}">

            <div class="cart-card-info">
                <h3>${producto.nombre}</h3>
                <h4>Precio unitario: $${producto.precio} UYU</h4>
                <p>${producto.info}</p>

                <div class="cart-controls">
                    <button class="btn-restar" data-id="${producto.id}">-</button>
                    <p class="cart-cantidad">Cantidad: ${producto.cantidad}</p>
                    <button class="btn-sumar" data-id="${producto.id}">+</button>
                </div>
            </div>

            <div class="cart-card-side">
                <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                <p class="cart-subtotal">Subtotal: $${producto.precio * producto.cantidad} UYU</p>
            </div>`;

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

// ------------------------------------------------------------------
// PAGINA CHECKOUT
//-------------------------------------------------------------------

// CONST DEL DOM - PAG. CHECKOUT
const checkoutProducts = document.getElementById("checkout-products");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutShipping = document.getElementById("checkout-shipping");
const checkoutTotal = document.getElementById("checkout-total");
const shippingDepto = document.getElementById("shipping-depto");
const btnPagar = document.getElementById("checkout-btn-pay");
const checkoutForm = document.getElementById("checkout-form");

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
            <img src="../${producto.img}" alt="${producto.nombre}">
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

// REVISAR SI TODOS LOS CAMPOS "REQUIRED" ESTAN COMPLETOS
function revisarFormularioCheckout() {
    btnPagar.disabled = !checkoutForm.checkValidity();
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
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const subtotal = calcularTotal();
        const envio = calcularEnvio();
        const totalFinal = subtotal + envio;
        const cantidadProductos = calcularCantidadProductos();

        //NOTIFICACION PARA CONFIRMAR COMPRA
        Swal.fire({
            title: "¿Confirmar la compra?",
            text: "Revisa los datos antes de continuar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ff6422",
            cancelButtonColor: "#90c9e9"
        }).then((result) => {

            if (result.isConfirmed) {

                //SE REUNE LA INFO A MOSTRAR EN EL RECIBO/COMPROBANTE
                let detalleProductos = "";

                carrito.forEach(prod => {
                    detalleProductos += `
                        <div style="display:grid; grid-template-columns: 1fr 60px 80px; align-items:center; margin-bottom:4px;">
                            <span>${prod.nombre}</span>
                            <span>x${prod.cantidad}</span>
                            <span>$${prod.precio}</span>
                        </div>`;
                });

                //SE NOTIFICA Y DA EL RECIBO
                Swal.fire({
                    title: "¡Compra realizada con éxito!",
                    html: `
                        <p style="margin-bottom: 12px; text-align:center;">
                            Gracias por tu compra en Glucon
                        </p>

                        <hr style="margin: 12px 0;">

                        <div style="text-align:left; font-size: 14px;">

                            <div style="display:grid; grid-template-columns: 1fr 60px 80px; align-items:center;">
                                <span>Producto</span>
                                <span>Cant.</span>
                                <span>Precio</span>
                            </div>

                            <hr style="margin: 6px 0;">

                            ${detalleProductos}

                            <hr style="margin: 10px 0;">

                            <p><strong>Subtotal:</strong> $${subtotal} UYU</p>
                            <p><strong>Envío:</strong> $${envio} UYU</p>

                            <hr style="margin: 10px 0;">

                            <p style="font-size: 18px; font-weight: 900; text-align: center;">
                                Total abonado: $${totalFinal} UYU
                            </p>
                        </div>

                        <p style="margin-top: 12px; font-size: 12px; opacity: 0.7;">
                            N° de orden: ${Date.now()}
                        </p>

                        <p style="margin-top: 10px; font-size: 13px; opacity: 0.75;">
                            Recibirás el comprobante en tu correo electrónico.
                        </p>`,
                    icon: "success",
                    confirmButtonText: "Volver al inicio",
                    confirmButtonColor: "#ff6422"
                }).then(() => {
                    carrito = [];
                    guardarCarrito();
                    renderCheckout();
                    revisarFormularioCheckout();
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
