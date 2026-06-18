// ESTADO DEL CARRITO GLOBAL 
if (typeof carrito === 'undefined') {
    window.carrito = [];
}

//  ESCUCHADOR GLOBAL DE CLICS
document.addEventListener("click", (e) => {

    // AGREGAR AL CARRITO
    if (e.target.classList.contains("btn-carrito")) {
        const boton = e.target;
        const tarjeta = boton.closest(".productoss");
        if (tarjeta) {
            const nombre = tarjeta.querySelector("h3").innerText;
            const precioTexto = tarjeta.querySelector(".precio").innerText;
            const precio = parseFloat(precioTexto.replace("S/", "").trim());

            const producto = {
                id: nombre.toLowerCase().replace(/\s+/g, '-'),
                nombre: nombre,
                precio: precio,
                cantidad: 1
            };

            const productoExistente = window.carrito.find(item => item.id === producto.id);
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                window.carrito.push(producto);
            }
            actualizarInterfazCarrito();
        
    // LANZAR NOTIFICACIÓN
            const contenedorToasts = document.querySelector(".toast-container");
            if (contenedorToasts) {
                const idToast = 'toast-' + Date.now();
                const nuevoToastHTML = `
                    <div id="${idToast}" class="toast toast-cafe align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2500">
                        <div class="d-flex">
                            <div class="toast-body d-flex align-items-center">
                                <span class="me-2" style="font-size: 0.9rem;">☕</span>
                                <div>
                                    <strong>¡Agregado con éxito!</strong><br>
                                    <small class="text-white-50">${nombre} se sumó al pedido.</small>
                                </div>
                            </div>
                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                `;

                contenedorToasts.insertAdjacentHTML("beforeend", nuevoToastHTML);

                const elToastElemento = document.getElementById(idToast);
                const bootstrapToast = new bootstrap.Toast(elToastElemento);
                bootstrapToast.show();

                elToastElemento.addEventListener('hidden.bs.toast', () => {
                    elToastElemento.remove();
                });
            }
        }
    }

    // ELIMINAR DEL CARRITO
    if (e.target.closest(".btn-eliminar-item")) { 
        const botonEliminar = e.target.closest(".btn-eliminar-item");
        const idProducto = botonEliminar.getAttribute("data-id");
        const productoEncontrado = window.carrito.find(item => item.id === idProducto);

        if (productoEncontrado) {
            if (productoEncontrado.cantidad > 1) {
                productoEncontrado.cantidad--;
            } else {
                window.carrito = window.carrito.filter(item => item.id !== idProducto);
            }
        }
        actualizarInterfazCarrito();
    }

    // 3. FILTROS ACTIVA EN LA TIENDA
    if (e.target.classList.contains("btn-filtro")) {
        const botonClicado = e.target;

        const contenedorTienda = botonClicado.closest(".seccion-menu") || document;
        contenedorTienda.querySelectorAll(".btn-filtro").forEach(btn => btn.classList.remove("active"));
        botonClicado.classList.add("active");

        const textoBoton = botonClicado.innerText.toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
        const tarjetasCafe = document.querySelectorAll(".seccion-productos .productoss");

        if (tarjetasCafe.length === 0) {
            console.warn("Opa, el JS no encontró las tarjetas con la clase '.seccion-productos .productoss'. Verifica tu HTML.");
            return;
        }

        tarjetasCafe.forEach(tarjeta => {
            const origen = tarjeta.getAttribute("data-origen");
            const origenLimpio = origen ? origen.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

            tarjeta.classList.remove("tarjeta-animada");
            
            if (textoBoton.includes("todos")) {
                tarjeta.style.setProperty("display", "flex", "important");
                void tarjeta.offsetWidth; 
                tarjeta.classList.add("tarjeta-animada");

            } else if (textoBoton.includes("andino") && origenLimpio === "andino") {
                tarjeta.style.setProperty("display", "flex", "important");
                void tarjeta.offsetWidth;
                tarjeta.classList.add("tarjeta-animada");

            } else if (textoBoton.includes("amaz") && origenLimpio === "amazonico") {
                tarjeta.style.setProperty("display", "flex", "important");
                void tarjeta.offsetWidth;
                tarjeta.classList.add("tarjeta-animada");
                
            } else {
                tarjeta.style.setProperty("display", "none", "important");
            }
        });
    }

});


// 2. ESCUCHADOR GLOBAL DE CAMBIOS

document.addEventListener("change", (e) => {
    if (e.target.id === "cart-toggle") {
        const fondoOscuro = document.getElementById("fondo-oscuro") || document.querySelector(".superposición-carrito");
        if (fondoOscuro) {
            if (e.target.checked) {
                fondoOscuro.classList.add("visible")
            } else {
                fondoOscuro.classList.remove("visible");
            }
        }
    }
});


// 3. ESCUCHADOR GLOBAL DE FORMULARIOS
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "form-contacto-kawsay") {
        e.preventDefault();
        
        const datosFormulario = new FormData(e.target);
        const nombreUsuario = datosFormulario.get("nombre") || "Gracias";
        const correoUsuario = datosFormulario.get("correo") || "correo";

        const contenedorFormulario = document.querySelector(".contacto-formulario");
        if (!contenedorFormulario) return;

        contenedorFormulario.style.opacity = "0";
        contenedorFormulario.style.transition = "opacity 0.3s ease";

        setTimeout(() => {
            contenedorFormulario.innerHTML = `
                <div class="mensaje-exito" style="text-align: center; padding: 40px; background-color: #f7f4f0; border-radius: 12px; animation: aparecerSuave 0.5s ease forwards;">
                    <i class="bi bi-check-circle" style="font-size: 48px; color: #2c221e;"></i>
                    <h3 style="font-family: 'Playfair Display'; color: #2c221e; margin-top: 20px; margin-bottom: 10px;">¡Gracias, ${nombreUsuario}!</h3>
                    <p style="color: #70665f; font-size: 14px; line-height: 1.6;">Hemos recibido tu mensaje correctamente. Te responderemos al correo <strong>${correoUsuario}</strong> lo más pronto posible. ¡Buen viaje y buen café! ☕</p>
                </div>
            `;
            contenedorFormulario.style.opacity = "1";
        }, 300);
    }
});


// ACTUALIZAR LA INTERFAZ DEL CARRIT
function actualizarInterfazCarrito() {
    const contenedorItems = document.getElementById("carrito-items");
    const contenedorTotal = document.getElementById("carrito-total-monto");
    const contadoresBadge = document.querySelectorAll(".carrito .badge");

    if (!contenedorItems || !contenedorTotal) return;
    contenedorItems.innerHTML = "";

    if (window.carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="carrito-vacio-txt">Tu carrito está vacío.</p>';
        contenedorTotal.innerText = "S/ 0.00";
        contadoresBadge.forEach(badge => badge.innerText = "0");
        return;
    }

    let totalAcumulado = 0;
    let cantidadTotalProductos = 0;

    window.carrito.forEach(item => {
        totalAcumulado += item.precio * item.cantidad;
        cantidadTotalProductos += item.cantidad;

        const itemElemento = document.createElement("div");
        itemElemento.style.display = "flex";
        itemElemento.style.justify = "space-between";
        itemElemento.style.marginBottom = "15px";
        itemElemento.style.fontSize = "14px";

        itemElemento.innerHTML = `
            <div>
                <strong style="color: #2c221e;">${item.nombre}</strong>
                <div style="color: #70665f; font-size: 12px;">Cant: ${item.cantidad} x S/ ${item.precio.toFixed(2)}</div>
            </div>
            <span style="font-weight: 500; color: #2c221e;">S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="btn-eliminar-item" data-id="${item.id}" style="background: none; border: none; color: #a39891; cursor: pointer; font-size: 20px; margin-left: 60px; ">
              <i class="bi bi-trash"></i>
            </button>
        `;
        contenedorItems.appendChild(itemElemento);
    });
    
    contenedorTotal.innerText = `S/ ${totalAcumulado.toFixed(2)}`;
    contadoresBadge.forEach(badge => badge.innerText = cantidadTotalProductos);
}