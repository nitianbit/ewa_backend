
import express from 'express'
import { createRequest, deleteRequest, detailRequest, gridRequest, updateRequest } from '../controllers/index.js';
const defaultRouter = express.Router();

//TODO add middlewares and auth check here
defaultRouter.post('/:module/create', createRequest);
defaultRouter.put('/:module/update',   updateRequest);
defaultRouter.get('/:module/:id/detail',   detailRequest);
defaultRouter.delete('/:module/:id/delete',  deleteRequest);
defaultRouter.get("/:module/grid"  , gridRequest);
defaultRouter.post("/:module/grid", gridRequest);

export default defaultRouter;