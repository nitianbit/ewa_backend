import express from 'express'
import { appointmentsByCompany, appointmentSummary, getAppointmentAndEarnings, getDashboardData, getUsers, patientsByAgeGroup, patientsByCompany, patientsByDoctor, patientsByGender } from "./controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/getAppointment", getAppointmentAndEarnings);
dashboardRouter.get("/getUsers", getUsers);
dashboardRouter.get("/stats", getDashboardData);
dashboardRouter.get("/patients-company-stats", patientsByCompany);
dashboardRouter.get("/appointments-company-stats", appointmentsByCompany);
dashboardRouter.get("/patients-doctor-stats", patientsByDoctor);
dashboardRouter.get("/patients-age-group-stats", patientsByAgeGroup);
dashboardRouter.get("/patients-gender-stats", patientsByGender);
dashboardRouter.get("/appointments/summary", appointmentSummary);
export default dashboardRouter;