import path from 'path';
import fs from 'fs';

export const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message: message,
        data: data
    });
}


export const now = () => Math.floor(Date.now() / 1000)


export const getAddressLine = (address) => {
    if (address) {
        return [
            address?.addressLine1,
            address?.addressLine2,
            address?.city,
            address?.state,
            address?.pinCode,
            address?.country,
        ]
            .filter(Boolean)
            .join(', ');
    }
    return null;
  };

export const createDirIfNotExist = (localFilePath) => {
    const directoryPath = path.dirname(localFilePath);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        // Recursive ensures all parent directories are created
        console.log(`Directory created: ${directoryPath}`);
    }
}  