const User = require("../models/User");
const {
  validateSignUp,
  ValidateLogin,
  validatePassword,
} = require("../helper/validators");
const bcrypt = require("bcrypt");
const OTP = require("../models/Otp");
const mailSender = require("../helper/mailSender");
const { encode: btoa } = require("base-64");
const { generateToken } = require("../helper/StreamChat");
const { UserInfo } = require("firebase-admin/auth");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");
const { sendOtp } = require("../helper/sendOtp");
const storeLastFivePassword = require("../utils/dbfunctions");
const compareWithLastPassword = require("../helper/compareWithLastpassword");
const jwt = require("jsonwebtoken");
const notificationService = require("../helper/NotificationService");
const notificationPayload = require("../utils/notificationpayload");

// login Controller
exports.Login = async (req, res, next) => {
  try {
    const userInfo = req?.body;
    ValidateLogin(userInfo);
    const existingUser = await User.findOne({ email: userInfo.email }).select(
      "+password"
    );

    if (!existingUser) {
      const error = new AppError(
        "User not found",
        responseCode.ResourceNotFound,
        false
      );
      return next(error);
    }
    const isPasswordVerified = await existingUser.validatePassword(
      userInfo.password
    );

    if (!isPasswordVerified) {
      const error = new AppError(
        "Invalid Password",
        responseCode.Invalid,
        false
      );
      return next(error);
    }
    const response = existingUser.toObject();
    delete response.password;
    const token_Saved = await notificationService.storeToken(
      existingUser._id,
      userInfo.fcmToken
    );
    response.tokenSaved = token_Saved;

    const token = await existingUser.getJWT();
    let chatToken;
    if (existingUser.isProfileSetup) {
      chatToken = await generateToken(existingUser);
    }
    // res.cookie("token", token);
    res.status(responseCode.OK).json({
      success: true,
      msg: "login Successfully",
      data: {
        user: response,
        token,
        chatToken,
        streamApiKey: btoa(
          process.env.STREAM_CHAT_API + process.env.ENCODE_SECRET
        ),
      },
    });
  } catch (err) {
    next(err);
  }
};

// signup controller

exports.signup = async (req, res, next) => {
  try {
    const userInfo = { ...req?.body };
    validateSignUp(userInfo);
    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
      const error = new AppError(
        "user already exist with this email",
        responseCode.Conflict,
        false
      );
      next(error);
      return;
    }
    const existingUsername = await User.findOne({
      userName: userInfo.userName,
    });
    if (existingUsername) {
      const error = new AppError(
        "user already exist with this username",
        responseCode.Conflict,
        false
      );
      return next(error);
    }

    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    await sendOtp(userInfo.email);
    const newUser = new User(userInfo);
    await newUser.save();
    const token = await newUser.getJWT();
    let response = newUser.toObject();
    const { fcmToken } = userInfo;
    let token_Saved = await notificationService.storeToken(
      newUser._id,
      fcmToken
    );
    response.tokenSaved = token_Saved;
    return res.status(responseCode.EntryCreated).json({
      success: true,
      message: `OTP has been sent to ${newUser.email}`,
      data: {
        userInfo: response,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// forget password

exports.forgetpassword = async (req, res, next) => {
  try {
    const { email } = req?.body;
    const existingUser = await User.findOne({
      email,
    });
    if (!existingUser) {
      throw new AppError(
        "User Doesnot Exist with This Email",
        responseCode.ResourceNotFound,
        false
      );
    }
    await notificationService.sendNotificationToOne(
      existingUser._id,
      "Someone is trying to login to your account",
      "alert"
    );
    await sendOtp(existingUser.email);
    res.status(responseCode.EntryCreated).json({
      message: `OTP has been sent to ${existingUser.email}`,
      success: true,
      ToShow: "otp-screen",
    });
  } catch (error) {
    next(error);
  }
};

// reset With Old Password
exports.resetWithOldPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, email } = req?.body;
    console.log(oldPassword, newPassword, email);
    validatePassword(newPassword);
    const user = await User.findOne({ email }).select("+password lastPassword");
    const isPasswordMatchedWithPast = await compareWithLastPassword(
      oldPassword,
      [...user.lastPassword, user.password]
    );
    if (!isPasswordMatchedWithPast) {
      throw new AppError(
        "Password You Entered doesn't match with the old Passwords",
        responseCode.BadRequest,
        false
      );
    }
    const isnewPasswordMatchedWithPast = await compareWithLastPassword(
      newPassword,
      [...user.lastPassword, user.password]
    );
    if (isnewPasswordMatchedWithPast) {
      throw new AppError(
        "Password You Entered match with the old Passwords try something else",
        responseCode.Conflict,
        false
      );
    }
    const isOldPasswordSaved = await storeLastFivePassword(
      user._id,
      user.password
    );
    if (!isOldPasswordSaved) {
      throw new AppError(
        "Unable to Change Password",
        responseCode.InternalServer,
        false
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(responseCode.EntryCreated).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

// otp verify

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, uses } = req.body;
    if (!email) {
      throw new AppError("Invalid Email", responseCode.Invalid, false);
    }
    if (!otp) {
      throw new AppError(
        "Please Enter OTP and Try Again !",
        responseCode.Invalid,
        false
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        "User not Exist with This Email !",
        responseCode.ResourceNotFound,
        false
      );
    }
    const existingOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!existingOtp) {
      throw new AppError(
        "OTP Expired or Not Found",
        responseCode.ResourceNotFound,
        false
      );
    }
    if (existingOtp.otp !== otp) {
      throw new AppError("Invalid OTP", responseCode.InvalidOTP, false);
    }
    user.isVerified = true;
    existingOtp.isOtpVerified = true;
    await user.save();
    let token;
    if (uses == "change-password") {
      token = await existingOtp.getJwt();
    }
    await existingOtp.deleteOne();
    return res.status(responseCode.OK).json({
      message: "OTP verified Done",
      success: true,
      otpVerifiedToken: token,
    });
  } catch (err) {
    next(err);
  }
};

// resend otp

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req?.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        "No account found with this email",
        responseCode.ResourceNotFound,
        false
      );
    }
    await sendOtp(user.email);
    res.status(responseCode.EntryCreated).json({
      message: `OTP sent Successfully`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// change Password

// needs otpVerifiedToken that will be generated when we pass uses:"change-password" when verifying otp

exports.changePassword = async (req, res, next) => {
  try {
    const { password, otpVerifiedToken } = req.body;
    validatePassword(password);
    const { email } = await jwt.verify(
      otpVerifiedToken,
      process.env.JWT_SECRET_OTP
    );
    if (!email) {
      throw new AppError("Your OTP is NOT verified yet. Verify and try again");
    }

    const user = await User.findOne({ email }).select("+password lastPassword");
    if (!user) {
      throw new AppError(
        "User doesn't exist with this email",
        responseCode.ResourceNotFound,
        false
      );
    }
    const isPasswordMatchedWithPast = await compareWithLastPassword(password, [
      ...user.lastPassword,
      user.password,
    ]);
    if (isPasswordMatchedWithPast) {
      throw new AppError(
        "can't use Password That was used Before",
        responseCode.Conflict,
        false
      );
    }
    const isOldPasswordSaved = await storeLastFivePassword(
      user._id,
      user.password
    );
    if (!isOldPasswordSaved) {
      throw new AppError(
        "Failed to update Password Try Again later",
        responseCode.InternalServer,
        false
      );
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Your password has been changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const {
      user,
      body: { fcmToken },
    } = req;
    if (!user) {
      throw new AppError();
    }
    const token_del = await notificationService.deleteToken(user._id, fcmToken);
    res.status(responseCode.OK).json({
      message: "Logout SuccessFully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
