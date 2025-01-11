import express from 'express'
import { getAppointmentAndEarnings, getUsers } from "./controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/getAppointment", getAppointmentAndEarnings);
dashboardRouter.get("/getUsers", getUsers);
export default dashboardRouter;