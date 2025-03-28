import mongoose from "mongoose";
import moment from "moment";

const DepartmentSchema = new mongoose.Schema(
    {
      name: { type: String, required: true }, // e.g., Cardiology, Neurology
      description: { type: String },
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: false,
      },
      image: { type: String },
    }
  );
  
const Department = mongoose.model('Department', DepartmentSchema);
export default Department
  