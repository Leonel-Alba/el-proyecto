const anuncios = [
    "🚚 Envíos gratis a todo el Perú por compras mayores a S/ 150",
    "☕ Café 100% Arábica de especialidad de orígenes únicos",
    "🏔️ Tostado artesanal respetando la altitud de cada región"
];

let indiceAnuncio = 0;

function rotarAnuncios() {
    const contenedorTexto = document.getElementById("anuncio-texto");
    if (!contenedorTexto) return;
    contenedorTexto.classList.add("anuncio-oculto");

    setTimeout(() => {
        indiceAnuncio = (indiceAnuncio + 1) % anuncios.length;
        contenedorTexto.innerText = anuncios[indiceAnuncio];
        contenedorTexto.classList.remove("anuncio-oculto");
    }, 400);
}

setInterval(rotarAnuncios, 4000);