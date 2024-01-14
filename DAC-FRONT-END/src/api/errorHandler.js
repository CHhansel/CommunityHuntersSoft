// errorHandler.js

/**
 * Maneja errores de API y devuelve un mensaje de error adecuado.
 * @param {Object} error - Objeto de error de Axios.
 * @returns {string} Mensaje de error.
 */
export function handleApiError(error) {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.response) {
        // La API devolvió un código de error fuera del rango 2xx
        // Aquí puedes personalizar los mensajes basándote en el status o la respuesta
        errorMessage = `Error ${error.response.status}: ${error.response.data.message}`;
    } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se pudo obtener una respuesta del servidor.';
    } else {
        // Algo más causó un error al hacer la solicitud
        errorMessage = error.message;
    }
    
 

    return errorMessage;
}
