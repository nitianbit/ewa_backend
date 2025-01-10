import mongoose from "mongoose";
import moment from "moment";

const CompanySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: Number,
        countryCode: { type: Number, default: 91 },
        contactperson: { type: String },
        noOfUser: { type: Number },
        website: { type: String },
        logo: { type: String },
        createdAt: {
            type: Number,
            default: moment().unix(),
        },
        isActive: { type: Boolean, default: true },
        updatedAt: { type: Number, },
    }
);

const Company = mongoose.model('Company', CompanySchema);
export default Company
