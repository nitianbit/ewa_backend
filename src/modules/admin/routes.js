import express from 'express'
import { getAllUserPagination, addBulkUsers, bulkUpdate, bulkDelete } from "./controller.js";

const adminRouter = express.Router();

adminRouter.post("/addBulkUser", addBulkUsers);
adminRouter.put("/bulkUpdate", bulkUpdate);
adminRouter.delete("/bulkDelete", bulkDelete);
adminRouter.get("/geAlltUsers", getAllUserPagination);
export default adminRouter;