const OTP = require("../models/Otp");
const responseCode = require("../utils/responseCode");
const AppError = require("../utils/AppError");
const verifyOTP = async (email, otp) => {
  try {
    console.log(email, otp);
    if (!email && !otp) {
      throw new AppError("missing params", responseCode.BadRequest);
    }
    const existingOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!existingOtp) {
      throw new AppError(
        "OTP Expired or Not Found",
        responseCode.ResourceNotFound
      );
    }
    if (existingOtp.otp !== otp) {
      throw new AppError("Invalid OTP", responseCode.InvalidOTP);
    }
    existingOtp.isOtpVerified = true;
    return existingOtp;
  } catch (error) {
    throw error;
  }
};
module.exports = verifyOTP;
// try {
//     const { otp, uses } = req.body;
//     if (!email) {
//       throw new AppError("Invalid Email", responseCode.Invalid, false);
//     }
//     if (!otp) {
//       throw new AppError(
//         "Please Enter OTP and Try Again !",
//         responseCode.Invalid,
//         false
//       );
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new AppError(
//         "User not Exist with This Email !",
//         responseCode.ResourceNotFound,
//         false
//       );
//     }
//     const existingOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

//     if (!existingOtp) {
//       throw new AppError(
//         "OTP Expired or Not Found",
//         responseCode.ResourceNotFound,
//         false
//       );
//     }
//     if (existingOtp.otp !== otp) {
//       throw new AppError("Invalid OTP", responseCode.InvalidOTP, false);
//     }
//     user.isVerified = true;
//     existingOtp.isOtpVerified = true;
//     await user.save();
//     let token;
//     if (uses == "change-password") {
//       token = await existingOtp.getJwt();
//     }
//     await existingOtp.deleteOne();
//     return res.status(responseCode.OK).json({
//       message: "OTP verified Done",
//       success: true,
//       token: token,
//     });
//   } catch (err) {
//     next(err);
//   }
