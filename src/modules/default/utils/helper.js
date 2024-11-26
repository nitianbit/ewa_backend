 
import { Brands } from "../../../db/models/Brands.js";
import { Category } from "../../../db/models/Category.js";
import { Products } from "../../../db/models/Products.js";
import { SubCategory } from "../../../db/models/SubCategory.js";
import { isValidAdmin, verifyToken } from "../../middlewares/index.js";

export const moduleMiddlewares = {
    'admin': [verifyToken, isValidAdmin],
    'supervisor': [verifyToken],//accessed by admin or supervisor
}

export const getModule = (module) => {
    switch (module) { 
        default:
            break;
    }
}