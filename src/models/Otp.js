const { model, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");

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
optSchema.methods.getJwt = async function () {
  const userOTP = this;
  const token = await jwt.sign(
    { _id: userOTP._id, email: userOTP.email },
    process.env.JWT_SECRET_OTP,
    {
      expiresIn: "10m",
    }
  );
  return token;
};
const OTP = model("OTP", optSchema);
module.exports = OTP;
