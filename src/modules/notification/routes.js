import express from 'express'
 
import { isValidAdmin, verifyToken } from '../middlewares/index.js';
import { saveDeviceToken, sendPushNotification } from './controller.js';
 
const notificationRouter = express.Router();

notificationRouter.post("/device/save",verifyToken, saveDeviceToken);
notificationRouter.get('/send',verifyToken ,isValidAdmin, sendPushNotification);
notificationRouter.get('/broadcast',verifyToken,isValidAdmin, sendPushNotification);

export default notificationRouter;



