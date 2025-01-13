// models/DeviceToken.js
import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },  
  token: { type: String, required: true, unique: true },  
  platform: { type: String, enum: ['iOS', 'Android', 'Web'], required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const DeviceTokens = mongoose.model('DeviceToken', deviceTokenSchema);
export default DeviceTokens
