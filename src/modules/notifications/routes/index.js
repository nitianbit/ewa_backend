
import express from 'express'
import { saveDeviceToken, sendNotification } from '../controllers/index.js';
import { verifyToken } from '../../middlewares/index.js';
const notificationRouter = express.Router();

notificationRouter.post('/save', verifyToken, saveDeviceToken);
notificationRouter.post('/schedule', verifyToken, sendNotification);

export default notificationRouter;