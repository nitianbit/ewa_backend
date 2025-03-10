import { Tokens } from "../../../db/models/Tokens.js";
import { sendResponse } from "../../../utils/helper.js";
import { showError } from "../../../utils/logger.js";


export const saveDeviceToken = async (req, res) => {
    try {
        const user_id = req.user._id;
        const token = req.body.token;
        const res = await Tokens.findOneAndUpdate({ user_id: user_id }, { fcm: token }, { upsert: true })
        return sendResponse(res, 200, "success");
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal server error", error);
    }
}