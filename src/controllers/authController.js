const User = require("../models/User");
const { validateSignUp, ValidateLogin } = require("../helper/validators");
const bcrypt = require("bcrypt");
const OTP = require("../models/Otp");
const mailSender = require("../helper/mailSender");
const { encode: btoa } = require("base-64");
const { generateToken } = require("../helper/StreamChat");
const { UserInfo } = require("firebase-admin/auth");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");
const { sendOtp } = require("../helper/sendOtp");
const { response } = require("express");

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

    const token = await existingUser.getJWT();
    const chatToken = await generateToken(existingUser);
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
    console.log(newUser, token);
    return res.status(responseCode.EntryCreated).json({
      success: true,
      message: `OTP has been sent to ${newUser.email}`,
      data: {
        userInfo: newUser,
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
    console.log(existingUser);
    if (!existingUser) {
      throw new AppError(
        "User Doesnot Exist with This Email",
        responseCode.ResourceNotFound,
        false
      );
    }
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
exports.resetWithOldPassword = async (req, res, next) => {};

// otp verify

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);
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
    console.log(existingOtp);

    if (existingOtp.otp !== otp) {
      throw new AppError("Invalid OTP", responseCode.InvalidOTP, false);
    }
    user.isVerified = true;
    existingOtp.isOtpVerified = true;
    await existingOtp.save();
    await user.save();
    return res
      .status(responseCode.OK)
      .json({ message: "OTP verified Done", success: true });
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

exports.changePassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isOtpVerified = await OTP.findOne({ email, isOtpVerified: true });
    if (!isOtpVerified) {
      throw new AppError("Your OTP is NOT verified yet. Verify and try again");
    }

    const user = await User.findOne({ email }).select("+password lastPassword");
    if (!user) {
      throw new AppError("User doesn't exist with this email");
    }

    if (user.password) {
      user.lastPassword.push(user.password);
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await OTP.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: "Your password has been changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
