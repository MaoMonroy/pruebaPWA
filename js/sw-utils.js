function ActualizarCacheDinamico(nombreCache, solicitud, respuesta) {
    //Si la respuesta tiene datos, se puede hacer
    if (respuesta.ok) {
        return caches.open(nombreCache).then(cacheAbierto => {
            cacheAbierto.put(solicitud, respuesta.clone());
            return respuesta.clone();
        });
    } else {
        //Si entra aquí, falló el caché y falló la red
        return respuesta;
    }
}