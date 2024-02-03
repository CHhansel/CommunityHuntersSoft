// hooks/useFileUpload.js

import { useState } from 'react';
import { FileUploadService } from '../../services/fileUploadServices';

export const useFileUpload = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = async (fileData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await FileUploadService.uploadFile(fileData);
            return response;  
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { uploadFile, isLoading, error };
};
