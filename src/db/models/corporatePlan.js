import mongoose from "mongoose";
import moment from "moment";


const CorporatePlanSchema = new mongoose.Schema({
    full_name :{
type: String,
require : true,},
 
email:{
  type: String,
  require : true,
},

size:{
  type:String,
  require:true,
},
goals:{
  type:String,
},
},
{
  collection: 'CorporatePlan',
});

const CorporatePlan = mongoose.model('CorporatePlan',CorporatePlanSchema);
export default CorporatePlan;