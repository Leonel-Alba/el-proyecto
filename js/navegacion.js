document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-principal");

  const urlParams = new URLSearchParams(window.location.search);
    const paginaACargar = urlParams.get('cargar');

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
                    history.replaceState(null, "", `${paginaACargar}.html`);
                }
            })
    }

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
            history.pushState(null, "", ruta);
            const todosLosEnlaces = document.querySelectorAll(".enlace-nav");
            todosLosEnlaces.forEach(enlace => enlace.classList.remove("active"));
            enlaceClicado.classList.add("active");
          }
        })
        .catch(err => console.error("Error en rutas SPA:", err));
    }
  });
});

