// hooks/useCertificateUpload.js

import { useState } from 'react';
import { FileUploadService } from '../../services/fileUploadServices'; 

export const useCertificateUpload = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadCertificate = async (fileData, companyId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await FileUploadService.uploadCertificate(fileData, companyId);
            return response;  
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { uploadCertificate, isLoading, error };
};
