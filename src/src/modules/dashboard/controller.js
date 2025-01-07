// modules/dashboard/controller.js
import { getTotalAppointments, getTodaysAppointments, getTotalEarnings, getTodaysEarnings, getTodaysUsers, getTotalUsers } from "./services.js";

export const getAppointmentAndEarnings = async (req, res)=>{
  try {
    const [totalAppointments, totalEarnings, todaysAppointments, todaysEarnings] = await Promise.all([
      getTotalAppointments(),
      getTotalEarnings(),
      getTodaysAppointments(),
      getTodaysEarnings(),
    ]);

    res.status(200).json({
      totalAppointments,
      totalEarnings: totalEarnings[0].totalEarnings,
      todaysAppointments,
      todaysEarnings: todaysEarnings[0].totalEarnings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getUsers = async (req, res)=>{
  try {
    const [totalUsers, todaysUsers] = await Promise.all([
      getTotalUsers(),
      getTodaysUsers(),
    ]);

    res.status(200).json({
      totalUsers,
      todaysUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}