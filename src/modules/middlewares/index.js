import { USER_TYPE } from "../../db/models/Admins.js";
import { sendResponse } from "../../utils/helper.js";
import { decodeToken } from "../auth/middlewares.js";
import { getModule, MODULES } from "../default/utils/helper.js";

export const verifyToken = (req, res, next) => {
    try {

        const exemptModules = [
            MODULES.SURGERY,        // "surgery"
            MODULES.SECONDOPINION,  // "secondOpinion"
            MODULES.EWAPACKAGES,    // "ewaPackages"
            MODULES.CORPORATEPLAN,  // "corporatePlan"
        ];

        const moduleName = req.params.module; // directly from URL

        console.log("Module:", moduleName); // "corporatePlan"

        if (exemptModules.includes(moduleName)) {
            return next(); // skip verifyToken
        }

        const token = req.headers['authorization'];
        if (!token) return sendResponse(res, 401, "UnAuthorized.");
        const decodedData = decodeToken(token);
        if (!decodedData.success) return sendResponse(res, 401, "UnAuthorized.");
        req.user = {
            ...decodedData.data,
            isAdmin: decodedData.data.role.includes(USER_TYPE.ADMIN),
            isSupervisor: decodedData.data.role.includes(USER_TYPE.SUPERVISOR)
        };

        next();
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const isValidAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (!user.isAdmin && !user.isSupervisor) return sendResponse(res, 401, "You are not allowded to perform this action.");
        next();
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}

export const isValidSupervisor = (req, res, next) => {
    try {
        const user = req.user;
        if (!user.isSupervisor) return sendResponse(res, 401, "You are not allowded to perform this action.");
        next();
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}