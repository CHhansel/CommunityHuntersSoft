// services/FileUploadService.js

import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';

export const FileUploadService = {
    uploadFile: async (fileData) => {

        try {
            const response = await DAC_API.post('/upload/upload-file', fileData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al subir el archivo:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};
