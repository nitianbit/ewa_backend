import mongoose from "mongoose";
import moment from "moment";

const CompanySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: Number,
        countryCode: { type: Number, default: 91 },
        contactPerson: { type: String },
        noOfEmployees: { type: Number },
        website: { type: String },
        logo: { type: String },
        createdAt: {
            type: Number,
            default: moment().unix(),
        },
        isActive: { type: Boolean, default: true },
        updatedAt: { type: Number, },
        codename: { type: String },
    }
);

const Company = mongoose.model('Company', CompanySchema);
export default Company
