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
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    appointmentDate: { type: Number, required: true },
    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.SCHEDULED,
    },
    fee: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    notes: { type: String },
    createdAt: { type: Number, default: moment().unix() },
    updatedAt: { type: Number },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laboratory",
    },
    type: { type: Number, enum: [1, 2] }, // 1: report, 2: prescription
    doctor_name: { type: String },
    department_name: { type: String },
    department_image: { type: String },
    package_name: { type: String }, // Package name
    package_image: { type: String }, // Package image
    laboratory_name: { type: String },
    vendor: { type: String },
    packages: { type: [String] },//for healhians only
    address: { type: String },
    zipcode: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
     patient_name: { type: String },
     company_name: { type: String },
     patient_email:String,
      patient_phone: { type: Number },
    city: { type: String },
    packages:{type:[String]},
    address:{type:String},
    zipcode:{type:String},
    location: {
    latitude: {type :Number},
    longitude: {type:Number},
  },
  city:{type:String},
    //for healhians only
  }
);

// Pre-save middleware to populate names and images
AppointmentSchema.pre("save", async function (next) {
  try {
    // Populate doctor_name
    if (this.doctor) {
      const doctor = await mongoose.model("Doctor").findById(this.doctor);
      if (doctor) {
        this.doctor_name = doctor.name;
      }
    }

    if (this.department) {
      // Populate department_name and department_image
      const department = await mongoose.model("Department").findById(this.department);
      if (department) {
        this.department_name = department.name;
        this.department_image = department.image;
      }
      // Remove package-related fields if department is selected
      this.package = undefined;
      this.package_name = undefined;
      this.package_image = undefined;
    }

    if (this.package) {
      // Populate package_name and package_image
      const packageData = await mongoose.model("Package").findById(this.package);
      if (packageData) {
        this.package_name = packageData.name;
        this.package_image = packageData.image;
      }
      // Remove department-related fields if package is selected
      this.department = undefined;
      this.department_name = undefined;
      this.department_image = undefined;
    }
    else if (this.packages && Array.isArray(this.packages) && this.packages.length > 0) {
      // If Healthians flow: set package_name from packages array
      this.package_name = this.packages[0];
      this.package_image = 'file/static/files/package/67c4b699377451c0a329df95/1740945050-bfe7736251d61649cc3f01302.png';
    }

    // Populate laboratory_name
    if (this.lab) {
      const lab = await mongoose.model("Laboratory").findById(this.lab);
      if (lab) {
        this.laboratory_name = lab.name;
      }
    }


    if (this.vendor) {
      this.laboratory_name = this.vendor;
    }

    if (this.patient) {
      const patient = await mongoose.model("Patient").findById(this.patient);
      if (patient) {
        this.patient_name = patient.name;
        this.patient_phone = patient.phone;
        this.patient_email=patient.email;
      }
      if(this.company)
      {
        const company = await mongoose.model("Company").findById(this.company);
        this.company_name=company.name;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
