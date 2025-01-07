
import express from 'express'
import { createRequest, deleteRequest, detailRequest, gridRequest, updateRequest } from '../controllers/index.js';
import { moduleMiddlewares } from '../utils/helper.js';
const defaultRouter = express.Router();


defaultRouter.use('/:module', (req, res, next) => {
    const middlewares = moduleMiddlewares[req.params.module] ?? []

    if (middlewares.length > 0) {
        middlewares.reduce((acc, middleware) => {
            return acc.then(() => {
                return new Promise((resolve, reject) => {
                    middleware(req, res, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });
        }, Promise.resolve())
            .then(() => next())
            .catch(next); 
    } else {
        next();
    }
});

//TODO add middlewares and auth check here
defaultRouter.post('/:module/create', createRequest);
defaultRouter.put('/:module/update',   updateRequest);
defaultRouter.get('/:module/:id/detail',   detailRequest);
defaultRouter.delete('/:module/:id/delete',  deleteRequest);
defaultRouter.get("/:module/grid"  , gridRequest);
defaultRouter.post("/:module/grid", gridRequest);

export default defaultRouter;