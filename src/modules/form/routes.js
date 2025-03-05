import express from 'express'
import { formGrid,handleFormCreateRequest } from './controller.js';
import { verifyToken } from '../middlewares/index.js';
 const formRouter = express.Router();

//formRouter.get("/grid",verifyToken, patientGrid)
formRouter.get("/grid", formGrid) ;
formRouter.post("/",handleFormCreateRequest);


export default formRouter;


