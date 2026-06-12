document.addEventListener("DOMContentLoaded", () => {
  const enlaces = document.querySelectorAll(".enlace-nav");
  const contenedor = document.getElementById("contenedor-principal");

  enlaces.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault(); 
      
      const ruta = enlace.getAttribute("href"); 

      fetch(ruta)
        .then(response => response.text())
        .then(html => {
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const nuevoContenido = doc.getElementById("contenedor-principal").innerHTML;

          contenedor.innerHTML = nuevoContenido;

          history.pushState(null, "", ruta);
        })
        .catch(error => console.error("Error al cargar la página:", error));
    });
  });
});