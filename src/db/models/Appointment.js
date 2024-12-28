import mongoose from "mongoose";
import moment from "moment";
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from "../../utils/constants.js";

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    }, // Optional for individual doctors
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    appointmentDate: { type: Date, required: true },
    timeSlot: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),  //SCHEDULED: "SCHD", COMPLETED: "COMP", CANCELLED: "CNCL", NO_SHOW: "NOSH"
      default: APPOINTMENT_STATUS.SCHEDULED,
    },
    fee: { type: Number, required: true }, // Fee for the appointment
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS), //PAID: "PD", PENDING: "PND", FAILED: "FLD"
      default: PAYMENT_STATUS.PENDING,
    },
    notes: {
      type: String,
    }, // Optional notes from the patient
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    updatedAt: { type: Number, },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment
