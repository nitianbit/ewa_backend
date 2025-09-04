import mongoose from "mongoose";
import moment from "moment";

const MarketingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: Number,
    countryCode: { type: Number, default: 91 },
    createdAt: {
      type: Number,
      default: moment().unix(),
    },
    role:[{type:String}],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    updatedAt: { type: Number, },
  }
);

const Marketing = mongoose.model('Marketing', MarketingSchema);
export default Marketing;

