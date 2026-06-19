document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-principal");

    const urlParams = new URLSearchParams(window.location.search);
    const paginaACargar = urlParams.get('cargar');

    // CARGA POR REFRESCO  
    if (paginaACargar) {
        fetch(`${paginaACargar}.html`)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo recargar la página");
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const nuevoContenido = doc.getElementById("contenedor-principal");
                
                if (nuevoContenido) {
                    contenedor.innerHTML = nuevoContenido.innerHTML;
                    history.replaceState({ pagina: paginaACargar }, "", `index.html?cargar=${paginaACargar}`);

                    inicializarFAQ(paginaACargar);
                }
            });
    }

    //  CARGA POR CLIC EN EL MENÚ 
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("enlace-nav")) {
            e.preventDefault(); 
            
            const enlaceClicado = e.target;
            const ruta = enlaceClicado.getAttribute("href"); 

            if (!ruta || ruta === "#" || ruta.startsWith(".")) return;

            fetch(ruta)
                .then(response => {
                    if (!response.ok) throw new Error("No se pudo cargar la página");
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const nuevoContenido = doc.getElementById("contenedor-principal");

                    if (nuevoContenido) {
                        contenedor.classList.remove("animar-entrada");
                        contenedor.innerHTML = nuevoContenido.innerHTML;
                        void contenedor.offsetWidth;

                        contenedor.classList.add("animar-entrada");
                        const nombrePagina = ruta.replace(".html", "");  
                        history.pushState({ pagina: nombrePagina }, "", `index.html?cargar=${nombrePagina}`);
                        
                        const todosLosEnlaces = document.querySelectorAll(".enlace-nav");
                        todosLosEnlaces.forEach(enlace => enlace.classList.remove("active"));
                        enlaceClicado.classList.add("active");
                       inicializarFAQ(nombrePagina);
                    }
                })
                .catch(err => console.error("Error en rutas SPA:", err));
        }
    });
});

// CARGA POR BOTÓN ATRÁS/ADELANTE DE CHROME
window.addEventListener("popstate", (e) => {
    const contenedor = document.getElementById("contenedor-principal");
    if (!contenedor) return;

    if (e.state && e.state.pagina) {
        fetch(`${e.state.pagina}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Error en historial");
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const nuevoContenido = doc.getElementById("contenedor-principal");
                
                if (nuevoContenido) {
                    contenedor.innerHTML = nuevoContenido.innerHTML;

                    const todosLosEnlaces = document.querySelectorAll(".enlace-nav");
                    todosLosEnlaces.forEach(enlace => {
                        enlace.classList.remove("active");
                        if (enlace.getAttribute("href").includes(e.state.pagina)) {
                            enlace.classList.add("active");
                        }
                    });
                    inicializarFAQ(e.state.pagina);
                }
            })
            .catch(() => window.location.reload());
    } else {
        window.location.href = "index.html";
    }
});

function inicializarFAQ(pagina) {
    if (pagina !== "nosotros" && !pagina.includes("nosotros")) return;

    const preguntas = document.querySelectorAll('.faq-pregunta');
    
    preguntas.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            const item = pregunta.parentElement;

            item.classList.toggle('activo');
        });
    });
}
