import { sendResponse } from "../../../utils/helper.js";
import { MODULES } from "../../default/utils/helper.js";
import { bulkUploadDoctors, bulkUploadPatients } from "../services/bulkUploadService.js";



export const bulkUpload = async (req, res) => {
    try {
        const module = req.params.module;
        const filePath = req.file?.path;
        let result = null;
        switch (module) {
            case MODULES.PATIENTS:
                result = await bulkUploadPatients(filePath,req.body?.company);
                break;
            case MODULES.DOCTOR:
                result = await bulkUploadDoctors(filePath);
                break;
            default:
                result = await bulkUploadPatients(filePath,req.body?.company);
                break;
        }

        return sendResponse(res, 200, "success", result);
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal server error", error);
    }
};