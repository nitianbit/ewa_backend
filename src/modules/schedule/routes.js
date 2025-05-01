import express from 'express'
import { fetchAvailablePackages, fetchAvailableSlots } from "./controller.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/available-slots", fetchAvailableSlots);
scheduleRouter.get("/available-packages", fetchAvailablePackages);
export default scheduleRouter;