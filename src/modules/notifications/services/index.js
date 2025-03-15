import admin from "firebase-admin";
// import serviceAccount from "../../../../ewa-health-care-firebase-adminsdk-yega2-fd26a5858e.json" assert { type: "json" };
import fs from "fs";
import { URL } from "url";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("../../../../ewa-health-care-firebase-adminsdk-yega2-fd26a5858e.json", import.meta.url), "utf-8")
);
import { showError } from "../../../utils/logger.js";
import moment from "moment";
import { NotificationModel } from "../../../db/models/Notifications.js";
import Patient from "../../../db/models/Patient.js";
import { Tokens } from "../../../db/models/Tokens.js";


class Notification {
    constructor() {
        //initialize firebase
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
 
    }

    createMessageObject = (data, notification) => {
        return {
            data,
            ...(notification && { notification }),
            android: {
                priority: 'high',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    }
                },
                headers: {
                    'apns-priority': '10'
                }
            }
        }
    }

    sendNotification = async ({ fcm_id, data, notification = null }) => {
        try {
            const message = this.createMessageObject(data, notification);
            const res = await admin.messaging().send({
                token: fcm_id,
                ...message,
            })
            return res;

        } catch (error) {
            showError(error);
        }
    }

    sendMultipleNotifications = async ({ fcmIds = [], data = {}, notification = null }) => {
        try {
            if (Array.isArray(fcmIds) && fcmIds?.length <= 0) return null;
            const messageObject = this.createMessageObject(data, notification);
            const message = {
                tokens: fcmIds,
                ...messageObject,
            };
            const result = await admin.messaging().sendEachForMulticast(message);
            return result;
        } catch (error) {
            showError(error);
        }
        return null;
    }

    executePendingNotifications = async () => {
        try {
            const pendingNotifications = await NotificationModel.find({
                status: 'pending',
                scheduledTime: { $lte: moment().unix() }
            });

            for (const notification of pendingNotifications) {
                try {
                    let sent = false;
                    //send notification to individual user
                    if (notification.user_id) {
                        const fcm = await Tokens.findOne({ user_id: notification.user_id });
                        if (fcm) {
                            await this.sendNotification({
                                fcm_id: fcm.fcm,
                                data: notification.payload,
                                notification: notification.notification
                            });
                        }
                        sent = true;
                        //send by company_id
                    } else if (notification.company_id) {
                        const users = await Patient.find({ company: notification.company_id });
                        const fcms = await Tokens.find({ user_id: { $in: users.map(user => user._id) } });
                        const fcmIds = fcms.map(fcm => fcm.fcm);

                        await this.sendMultipleNotifications({
                            fcmIds,
                            data: notification.payload,
                            notification: notification.notification
                        });
                        sent = true;
                    } else if (users.length) {
                        const fcms = await Tokens.find({ user_id: { $in: users } });
                        const fcmIds = fcms.map(fcm => fcm.fcm);
                        await this.sendMultipleNotifications({
                            fcmIds,
                            data: notification.payload,
                            notification: notification.notification
                        });
                        sent = true;
                    }

                    if (sent) {
                        await NotificationModel.updateOne(
                            { _id: notification._id },
                            { $set: { status: "sent" } }
                        );
                    }
    
                } catch (error) {

                }
            }

            console.log("cron job done for pending notification...")

        } catch (error) {

        }
    }

}

const notification = new Notification();
export default notification;

