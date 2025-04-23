const { model, Schema } = require("mongoose");
const optSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxLength: 40,
  },
  otp: {
    type: String,
    required: true,
    unique: true,
  },
  isOtpVerified: {
    default: false,
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const OTP = model("OTP", optSchema);
module.exports = OTP;
