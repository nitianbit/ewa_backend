import mongoose from "mongoose";
import moment from "moment";


const EwaPackageSchema = new mongoose.Schema({
    full_name :{
type: String,
require : true,
},
 
email:{
  type: String,
  require : true,
},

EwaPackage:{
  type:String,
  require:true,
},
message:{
  type:String,
},
},
{
  collection: 'EwaPackage',
});

const EwaPackage = mongoose.model('EwaPackage',EwaPackageSchema);
export default EwaPackage;