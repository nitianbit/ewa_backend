import express from 'express'
import { appointmentsByCompany, getAppointmentAndEarnings, getDashboardData, getUsers, patientsByCompany, patientsByDoctor } from "./controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/getAppointment", getAppointmentAndEarnings);
dashboardRouter.get("/getUsers", getUsers);
dashboardRouter.get("/stats", getDashboardData);
dashboardRouter.get("/patients-company-stats", patientsByCompany);
dashboardRouter.get("/appointments-company-stats", appointmentsByCompany);
dashboardRouter.get("/patients-doctor-stats", patientsByDoctor);
export default dashboardRouter;