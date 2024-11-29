import { User } from '../../db/models/User';
import { OTP } from '../../db/models/Otp';


// User
// Get a user by email
export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).lean();
};

// Get a user by phone
export const getUserByPhone = async (phone, countryCode) => {
  return await User.findOne({ phone, countryCode }).lean();
}

// Get a user 
export const getUser = async (filter) => {
  return await User.findOne(filter).lean();
};

// Get a user by ID without sensitive fields
export const getUserById = async (id) => {
  return await User.findById(id).select('-password -userType').lean();
};

// Create a new user
export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Update a user's data
export const updateUser = async (id, updatedData) => {
  return await User.findByIdAndUpdate(id, updatedData, { new: true }) // Ensures updated data is returned
    .select('-password -userType')
    .lean();
};





// OTP
// Get an OTP by userId and method (phone/email)
export const getOTPByUserIdAndMethod = async (userId, target) => {
  return await OTP.findOne({
    userId,
    target,
    expireAt: { $gt: new Date() } // Only return non-expired OTP
  }).lean();
};


// Create or update an OTP for a user
export const createOrUpdateOTP = async (userId, target) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return await OTP.findOneAndUpdate(
    { userId },
    {
      otp,
      target,
      expireAt: new Date(Date.now() + 5 * 60 * 1000) // Expires in 5 minutes
    },
    { upsert: true, setDefaultsOnInsert: true, new: true }
  ).lean();
};

// Delete all OTPs associated with a user
export const deleteOTPByUserId = async (userId) => {
  return await OTP.deleteMany({ userId });
};

// Verify an OTP for a user by method
export const verifyOTPQuery = async (userId, otp, method) => {
  const otpData = await getOTPByUserIdAndMethod(userId, method);
  if (!otpData || otpData.otp !== otp || otpData.expireAt < new Date()) {
    return false;
  }

  // Mark OTP as verified (optional)
  await OTP.findByIdAndUpdate(otpData._id, { verified: true });

  await deleteOTPByUserId(userId); // Delete all OTPs for the user after verification
  return true;
};