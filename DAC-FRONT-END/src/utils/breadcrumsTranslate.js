// Diccionario de traducciones
const translations = {
    dashboard: "Tablero",
    properties: "Propiedades",
    clients: "Clientes",

    // ... puedes agregar más traducciones aquí en el futuro
};

/**
 * Traduce el nombre de una ruta utilizando el diccionario de traducciones.
 * @param {string} name - El nombre de la ruta a traducir.
 * @returns {string} - La traducción del nombre o el nombre original si no se encuentra una traducción.
 */
function translate(name) {
    return translations[name] || name;
}

/**
 * Traduce los nombres de las rutas en un array de rutas.
 * @param {Array} routes - El array de rutas a traducir.
 * @returns {Array} - El array de rutas con los nombres traducidos.
 */
export function translateRoutes(routes) {
    return routes.map(route => ({
        ...route,
        name: translate(route.name)
    }));
}
