import { isValidAdmin, verifyToken } from "../../middlewares/index.js";

export const moduleMiddlewares = {
    'admin': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken],//accessed by admin or supervisor
    'doctos':[verifyToken]
}

export const getModule = (module) => {
    switch (module) { 
        default:
            break;
    }
}