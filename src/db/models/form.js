import mongoose from "mongoose";
import moment from "moment";


const formSchema = new mongoose.Schema({
    first_nme :{
type: String,
require : true,},

last_name :{
  type: String,
require : true,
},

gender:{
  type: String,
  enum:['male','female','others'],
require : true,
},
 
email:{
  type: String,
  require : true,
  unique:true,
},
 
mobile:{
  type:String,
  require:true,
  unique:true,
},

address:{
  type:String,
  require:true,
},

enquire_about:{
  type:String,
  require:true,
},
},
{
  collection: 'Form',
});

const Form = mongoose.model('Form',formSchema);
export default Form;