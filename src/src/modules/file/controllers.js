import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import { parseFormFields, saveFilesToDirectory } from "./services.js";
import settings from '../../../settings.js'
import fs from 'fs'
 


export const uploadFile = async (req, res) => {
    try {
        const { body, files } = await parseFormFields(req);
        const { module, record_id } = body;
        const filePaths = saveFilesToDirectory(files, module,record_id);
        return sendResponse(res, 200, "success", filePaths);
    } catch (error) {
       showError(error);
       return sendResponse(res, 500, "Internal server error", error);
    }

}   


export const statisFiles = async (req, res) => {
    try {
        const localPath = `${settings.PROJECT_DIR}/${req.params.var}`;

        if (!fs.existsSync(localPath)) {
            res.send()
        }
        else {
            let file = fs.readFileSync(localPath);
            let contentType = 'image/jpeg'
            res.setHeader('Content-Length', file.length);
            res.setHeader('Content-type', contentType);
            res.write(file, 'binary');
            res.end();
        }
    } catch (error) {
        showError(error);
        sendResponse(res, 500, 'Something went wrong', error);
    }
}
