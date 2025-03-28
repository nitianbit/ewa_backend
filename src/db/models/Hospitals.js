import mongoose from "mongoose";
import moment from "moment";

const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ], // departments belong to this hospital
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    updatedAt: { type: Number, },
  }
);

const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital
