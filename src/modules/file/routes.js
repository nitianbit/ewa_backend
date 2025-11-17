import express from 'express'
import { statisFiles, uploadFile } from './controllers.js';
import { verifyToken } from '../middlewares/index.js';
 
const fileRouter = express.Router();

fileRouter.post("/upload/:module",verifyToken, uploadFile);
fileRouter.post("/upload",verifyToken, uploadFile);
fileRouter.get('/static/:var(*)', statisFiles)//open api

export default fileRouter;



