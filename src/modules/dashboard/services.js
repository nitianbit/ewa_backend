// db/services/appointment.service.js
import { User } from "../../db/models/User.js";
import Appointment from '../../db/models/Appointment.js'

export const getTotalAppointments = async () => {
  return await Appointment.countDocuments();
};

export const getTodaysAppointments = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await Appointment.find({
    appointmentDate: { $gte: startOfDay, $lte: endOfDay },
  });
};

export const getTotalEarnings = async () => {
  return await Appointment.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$fee" },
      },
    },
  ]);
};

export const getTodaysEarnings = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await Appointment.aggregate([
    {
      $match: {
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$fee" },
      },
    },
  ]);
};


export const getTotalUsers = async () => {
  return await User.countDocuments();
};

export const getTodaysUsers = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await User.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
};