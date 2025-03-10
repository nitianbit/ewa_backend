import admin from "firebase-admin";
import serviceAccount from "../../../../ewa-health-care-firebase-adminsdk-yega2-83afdceeb3.json" assert { type: "json" };
import { showError } from "../../../utils/logger.js";


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

    sendMultipleNotifications = async ({fcmIds = [], data = {}, notification = null}) => {
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

x
}

const notification=new Notification();
export default notification;

