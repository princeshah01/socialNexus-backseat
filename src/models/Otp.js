const { model, Schema } = require("mongoose");
const optSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    maxLength: 40,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 59,
  },
});

const OTP = model("OTP", optSchema);
module.exports = OTP;
