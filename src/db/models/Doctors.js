import mongoose from "mongoose";
import moment from "moment";

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String },
    degree: { type: String },
    description: { type: String },
    email: { type: String, unique: true, required: true },
    phone: Number,
    countryCode: { type: Number, default: 91 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    isIndividual: { type: Boolean, default: false },
    role: { type: [String] },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    company:{
     type:mongoose.Schema.Types.ObjectId,
     ref: 'Company',
     require:true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],
    fee: { type: Number },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    updatedAt: { type: Number, },
  }
);

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;

