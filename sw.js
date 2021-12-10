importScripts('js/sw-utils.js');

const CACHE_ESTATICO = "estatico-v2";
const CACHE_DINAMICO = "dinamico-v1";
const CACHE_INMUTABLE = "inmutable-v1";

const CONT_ESTATICO = [
    '/', 'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const CONT_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener("install", evInstall => {

    const cacheEstatico = caches.open(CACHE_ESTATICO).then(estaticoAbierto => {
        estaticoAbierto.addAll(CONT_ESTATICO);
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(inmutableAbierto => {
        inmutableAbierto.addAll(CONT_INMUTABLE);
    });

    evInstall.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
});

self.addEventListener("activate", evActivate => {

    const respuesta = caches.keys().then(llaves => {
        llaves.forEach(llave => {
            if (llave != CACHE_ESTATICO && llave.includes("estatico")) {
                return caches.delete(llave);
            }
        });
    });

    evActivate.waitUntil(respuesta);
});

self.addEventListener("fetch", evFetch => {

    const respuesta = caches.match(evFetch.request).then(archivoExiste => {
        if (archivoExiste) return archivoExiste;

        return fetch(evFetch.request).then(respuestaDescarga => {
            return ActualizarCacheDinamico(CACHE_DINAMICO, evFetch.request, respuestaDescarga);
        });
    });

    evFetch.respondWith(respuesta);
});