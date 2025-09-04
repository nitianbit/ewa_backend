import express from 'express'
import { packagesGrid } from './controller.js';
import { verifyToken } from '../middlewares/index.js';
const packagesRouter = express.Router();

packagesRouter.get("/grid", packagesGrid) 

export default packagesRouter;



