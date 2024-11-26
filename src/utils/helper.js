import { isValidAdmin, verifyToken } from "../modules/middlewares/index.js";

export const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message: message,
        data: data
    });
}


export const now = () => Math.floor(Date.now() / 1000)

export const moduleMiddlewares = {
    'corporate': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken], 
}

export const getModule = (module) => {
    switch (module) {
        case 'user':
            return User;
        case 'admin':
            return Admin;
        case 'corporate':
            return Corporates;
        case 'bank':
            return Bank;
        case 'country':
            return Country;
        case 'supervisor':
            return Supervisor;

        default:
            break;
    }
}

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