import DeviceTokens from "../../db/models/DeviceTokens.js";
import { sendResponse } from "../../utils/helper.js";
import { showError } from "../../utils/logger.js";
import admin from "firebase-admin";
import serviceAccount from "../../../ewa-health-care-firebase-adminsdk-yega2-ec19420c9b.json" assert { type: "json" };

 
 admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

/**
 * Sends a push notification to a set of users or all users.
 *
 * @param {Array<string>} tokens - The device tokens of the users. Pass an empty array to send to all users.
 * @param {Object} message - The notification payload.
 * @param {string} topic - (Optional) The topic to send notifications to. Used when `tokens` is empty.
 */
export const sendPushNotification = async (tokens = [], message, topic = null) => {
    try {
        if (tokens.length > 0) {
            // Send notifications to specific device tokens
            const response = await admin.messaging().sendMulticast({
                tokens: tokens,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data || {},
            });

            console.log(
                `Successfully sent notifications to ${response.successCount} devices.`
            );
            if (response.failureCount > 0) {
                console.error("Failed tokens:", response.responses.filter((res) => !res.success).map((res, idx) => tokens[idx]));
            }
        } else if (topic) {
            // Send notifications to all users subscribed to a specific topic
            const response = await admin.messaging().send({
                topic: topic,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data || {},
            });

            console.log("Successfully sent notifications to topic:", topic);
        } else {
            throw new Error("Either tokens or topic must be specified.");
        }
    } catch (error) {
        console.error("Error sending push notifications:", error.message);
    }
};

export const notify=async(req,res)=>{
    try {
        const {tokens,message,topic}=req.body;
        await sendPushNotification(tokens,message,topic);
        return sendResponse(res, 200, 'Notification sent successfully.');
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}



export const saveDeviceToken = async (req, res) => {
    try {
        const { userId, token, platform } = req.body;

        if (!userId || !token || !platform) {
            return sendResponse(res, 400, 'userId, token, and platform are required.');
        }
        // Upsert the token (update if exists, otherwise insert)
        const deviceToken = await DeviceTokens.findOneAndUpdate(
            { token },
            { userId, platform },
            { upsert: true, new: true }
        );

        return sendResponse(res, 200, 'Device token saved successfully.', deviceToken);
    } catch (error) {
        showError(error);
        return sendResponse(res, 500, "Internal Server Error", error);
    }
}
