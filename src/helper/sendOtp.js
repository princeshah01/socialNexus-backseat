const OTP = require("../models/Otp");
const mailSender = require("../helper/mailSender");
const { generateOtp } = require("../utils/Generator");
const responseCode = require("../utils/responseCode");
const { subHours } = require("date-fns");
const AppError = require("../utils/AppError");
exports.sendOtp = async (email) => {
  try {
    const timeToCheckFor = subHours(new Date(), 1);
    console.log(timeToCheckFor);
    const existingOTP = await OTP.countDocuments({
      email,
      createdAt: { $gt: timeToCheckFor },
    });
    if (existingOTP >= 3) {
      throw new AppError(
        "Too many OTP requests try again later",
        responseCode.TooManyRequest,
        false
      );
    }
    const otp = generateOtp();
    const savedOTP = new OTP({
      email,
      otp,
    });
    if (!savedOTP) {
      throw new AppError(
        "Unable To Generate OTP",
        responseCode.InternalServer,
        false
      );
    }
    await savedOTP.save();
    console.log(
      "----------",
      savedOTP.otp,
      " --otp that will be sent to user-- "
    );
    // call mail sender here
    // mailSender(email, otp);
  } catch (error) {
    throw error;
    console.log(error);
  }
};
