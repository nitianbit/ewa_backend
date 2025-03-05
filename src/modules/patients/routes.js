import express from 'express'
import { patientGrid } from './controller.js';
import { verifyToken } from '../middlewares/index.js';
 const patientRouter = express.Router();

patientRouter.get("/grid",verifyToken, patientGrid) 

export default patientRouter;



