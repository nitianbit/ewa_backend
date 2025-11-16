import mongoose from "mongoose";
import moment from "moment";


const SecondOpinionSchema = new mongoose.Schema({
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
medical_record:{
  type:[String],
},
},
{
  collection: 'SecondOpinion',
});

const SecondOpinion = mongoose.model('SecondOpinion',SecondOpinionSchema);
export default SecondOpinion;