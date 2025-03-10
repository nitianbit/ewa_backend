
import express from 'express'
import { saveDeviceToken } from '../controllers/index.js';
import { verifyToken } from '../../middlewares/index.js';
const notificationRouter = express.Router();
 
notificationRouter.post('/save',verifyToken, saveDeviceToken);
 

export default notificationRouter;