// services/FileUploadService.js

import DAC_API from '../api/db-connection';  // Asegúrate de usar la ruta correcta
import { handleApiError } from '../api/errorHandler';

export const FileUploadService = {
    uploadFile: async (fileData) => {

        try {
            const response = await DAC_API.post('/upload/upload-img', fileData);
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al subir el archivo:', errorMessage);
            throw new Error(errorMessage);
        }
    },
    uploadCertificate: async (fileData, companyId) => {
        try {
            // Si necesitas enviar el companyId junto con el archivo, asegúrate de incluirlo en el FormData
            const formData = new FormData();
            formData.append('certificateFile', fileData); // Asegúrate de que 'certificateFile' coincida con el nombre esperado en el backend
            formData.append('company_id', companyId); // Agrega el company_id si es necesario para tu lógica de negocio

            const response = await DAC_API.post('upload/upload-certificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('Error al subir el certificado:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};
