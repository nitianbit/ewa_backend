import moment from "moment";
import { NotificationModel } from "../../../db/models/Notifications.js";
import { Tokens } from "../../../db/models/Tokens.js";
import { sendResponse } from "../../../utils/helper.js";
import { showError } from "../../../utils/logger.js";
import notification from "../services/index.js";


export const saveDeviceToken = async (req, res) => {
    try {
        const user_id = req.user._id;
        const token = req.body.token;
        const response = await Tokens.findOneAndUpdate({ user_id: user_id }, { fcm: token }, { upsert: true })
        return sendResponse(res, 200, "success");
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal server error", error);
    }
}

//send or schedule notification
export const sendNotification = async (req, res) => {
    try {
        const { user_id, company_id, users, payload, notification, scheduledTime } = req.body;

        if (!user_id && !company_id && (!Array.isArray(users) || users.length === 0)) {
            return sendResponse(res, 400, "One of user_id, company_id, or users must be provided.");
        }

        if (!payload) {
            return sendResponse(res, 400, "Payload and scheduledTime are required.");
        }
        const validStatuses = ["pending", "sent", "failed"];
        const finalStatus = validStatuses.includes(status) ? status : "pending";
        const reqParam = {
            ...(user_id && { user_id }),
            ...(company_id && { company_id }),
            ...(Array.isArray(users) && { users }),
            payload,
            ...(notification && { notification }),
            ...(scheduledTime ? { scheduledTime } : { scheduledTime: moment().unix() }),
            status: finalStatus,
        }
        const doc = new NotificationModel(reqParam);
        await doc.save();
        return sendResponse(res, 200, "success");
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal server error", error);
    }
}


export const executePendingNotifications=async(req,res)=>{
    try {
        notification.executePendingNotifications();      
        return sendResponse(res, 200, "success");
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal server error", error);
    }
}


