import mongoose from "mongoose";
import moment from "moment";

const AvailabilitySchema = new mongoose.Schema(
    {
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
      },
      day: { type: Number, required: true }, // e.g., "YYYYMMDD"
      timings: {
        start: { type: Number, required: true }, 
        end: { type: Number, required: true },   
      },
      createdAt: {
        type: Number,
        default: moment().unix(),
      },
    updatedAt: { type: Number,  },
    }
  );
  
  const  Availability = mongoose.model('Availability', AvailabilitySchema);
  export default Availability
  