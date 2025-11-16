import mongoose from "mongoose";
import moment from "moment";


const SurgerySchema = new mongoose.Schema({
    full_name :{
type: String,
require : true,},
 
email:{
  type: String,
  require : true,
},

concern:{
  type:String,
  require:true,
},
speciality:{
  type:String,
  require:true,
},
medical_record:{
  type:[String],
},
},
{
  collection: 'Surgery',
});

const Surgery = mongoose.model('Surgery',SurgerySchema);
export default Surgery;