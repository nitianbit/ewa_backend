import express from 'express'
import { RaiseRequestGrid,handleRaiseRequest, updateRaiseRequest } from './controller.js';
import { isValidAdmin, verifyToken } from '../middlewares/index.js';
 const RaiseRequestRouter = express.Router();

//RaiseRequestRouter.get("/grid",verifyToken, patientGrid)
RaiseRequestRouter.get("/grid", RaiseRequestGrid) ;
RaiseRequestRouter.post("/",handleRaiseRequest);
RaiseRequestRouter.put("/:id", verifyToken, isValidAdmin, updateRaiseRequest);



export default RaiseRequestRouter;


