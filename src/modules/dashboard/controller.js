// modules/dashboard/controller.js
import moment from "moment";
import { getTotalAppointments, getTodaysAppointments, getTotalEarnings, getTodaysEarnings, getTodaysUsers, getTotalUsers } from "./services.js";
import Appointment from "../../db/models/Appointment.js";
import Patient from "../../db/models/Patient.js";
import Doctor from "../../db/models/Doctors.js";
import Company from "../../db/models/Company.js";
import {sendResponse,} from "../../utils/helper.js";
import {showError} from "../../utils/logger.js";
import mongoose from "mongoose";

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


export const getDashboardData = async (req, res) => {
  try {
      const { company_id } = req.query; 

      const todayStart = moment().startOf('day').toDate();
      const todayEnd = moment().endOf('day').toDate();
      const thisWeekStart = moment().startOf('week').toDate();
      const thisWeekEnd = moment().endOf('week').toDate();
      const thisMonthStart = moment().startOf('month').toDate();
      const thisMonthEnd = moment().endOf('month').toDate();

      const matchStage = company_id ? { company: mongoose.Types.ObjectId(company_id) } : {};

      const [
          totalAppointmentsToday,
          totalAppointmentsThisWeek,
          totalAppointmentsThisMonth,
          totalPatients,
          totalDoctors,
          totalCompanies
      ] = await Promise.all([
          // Total appointments today
          Appointment.countDocuments({ ...matchStage, appointmentDate: { $gte: todayStart, $lte: todayEnd } }),
          // Total appointments this week
          Appointment.countDocuments({ ...matchStage, appointmentDate: { $gte: thisWeekStart, $lte: thisWeekEnd }}),
          // Total appointments this month
          Appointment.countDocuments({ ...matchStage, appointmentDate: { $gte: thisMonthStart, $lte: thisMonthEnd }}),
          // Total patients
          Patient.countDocuments(matchStage),
          // Total doctors
          Doctor.countDocuments(matchStage),
          // Total companies
          company_id ? 1 : Company.countDocuments({})
      ]);

      return sendResponse(res, 200, "Success", {
          totalAppointmentsToday,
          totalAppointmentsThisWeek,
          totalAppointmentsThisMonth,
          totalPatients,
          totalDoctors,
          totalCompanies
      });
  } catch (error) {
      showError(error);
      return sendResponse(res, 500, "Internal server error", error);
  }
};

export const patientsByCompany = async (req, res) => {
  try {
    const { company_id } = req.query;
    const matchStage = company_id ? { $match: { company: mongoose.Types.ObjectId(company_id)  } } : { $match: {} };

    const patientsCompany = await Patient.aggregate([
      matchStage,
      {
        $group: {
          _id: "$company",  
          totalPatients: { $sum: 1 }  
        }
      },
      {
        $lookup: {
          from: 'companies',  
          localField: '_id',
          foreignField: '_id',
          as: 'companyDetails'
        }
      },
      {
        $unwind: "$companyDetails" 
      },
      {
        $project: {
          companyName: "$companyDetails.name", 
          totalPatients: 1
        }
      }
    ]);

    const dataForPieChart = patientsCompany.map(item => ({
      name: item.companyName,
      value: item.totalPatients
    }));

    return sendResponse(res, 200, "Success", dataForPieChart);
  } catch (error) {
    showError(error);
    return sendResponse(res, 500, "Internal server error", error);
  }
};

export const appointmentsByCompany = async (req, res) => {
  try {
    const { company_id } = req.query; 

    const matchStage = company_id ? { $match: { company: mongoose.Types.ObjectId(company_id) } } : { $match: {} };

    const appointments = await Appointment.aggregate([
      matchStage,
      {
        $group: {
          _id: "$company",  
          totalAppointments: { $sum: 1 }, 
        }
      },
      {
        $lookup: {
          from: 'companies',  
          localField: '_id',
          foreignField: '_id',
          as: 'companyDetails'
        }
      },
      {
        $unwind: "$companyDetails"  
      },
      {
        $project: {
          companyName: "$companyDetails.name",
          totalAppointments: 1
        }
      }
    ]);

    const dataForPieChart = appointments.map(item => ({
      name: item.companyName,
      value: item.totalAppointments
    }));

    return sendResponse(res, 200, "Success", dataForPieChart);
  } catch (error) {
    showError(error);
    return sendResponse(res, 500, "Internal server error", error);
  }
};

export const patientsByDoctor = async (req, res) => {
  try {
    const { company_id } = req.query;

    const matchStage = company_id ? { $match: { company: mongoose.Types.ObjectId(company_id) } } : { $match: {} };

    const patients = await Patient.aggregate([
      matchStage,
      {
        $group: {
          _id: "$doctor",  
          totalPatients: { $sum: 1 }  
        }
      },
      {
        $lookup: {
          from: 'doctors',  
          localField: '_id',
          foreignField: '_id',
          as: 'doctorDetails'
        }
      },
      {
        $unwind: "$doctorDetails" 
      },
      {
        $project: {
          doctorName: "$doctorDetails.name", 
          totalPatients: 1
        }
      }
    ]);

    const dataForPieChart = patients.map(item => ({
      name: item.doctorName,
      value: item.totalPatients
    }));

    return sendResponse(res, 200, "Success", dataForPieChart);
  } catch (error) {
    showError(error);
    return sendResponse(res, 500, "Internal server error", error);
  }
};


// no of patient per doctor pie chart
// company wise employeed pie chart (only for admin)
//