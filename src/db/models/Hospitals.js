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
    updatedAt: { type: Number,  },
  }
);

export default Hospital = mongoose.model('Hospital', HospitalSchema);
