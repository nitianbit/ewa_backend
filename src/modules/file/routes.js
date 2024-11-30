import express from 'express'
import { statisFiles, uploadFile } from './controllers.js';
 
const fileRouter = express.Router();

fileRouter.post("/upload", uploadFile);
fileRouter.get('/static/:var(*)', statisFiles)

export default fileRouter;



