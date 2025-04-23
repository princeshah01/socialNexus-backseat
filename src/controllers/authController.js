const User = require("../models/User")
const { validateSignup, ValidateLogin } = require("../helper/validators")
const bcrypt = require("bcrypt")
const { generateOtp } = require("../utils/Generator")
const OTP = require("../models/Otp")
const mailSender = require("../helper/mailSender")
const { encode: btoa } = require("base-64");
const { generateToken } = require("../helper/StreamChat");
const { UserInfo } = require("firebase-admin/auth")
const AppError = require("../utils/AppError")
const responseCode = require("../utils/responseCode")

// login Controller
exports.Login = async (req, res, next) => {
    try {
        const userInfo = req?.body;
        ValidateLogin(userInfo);
        const existingUser = await User.findOne({ email: userInfo.email }).select(
            "+password"
        );

        if (!existingUser) {
            const error = new AppError("User not found", responseCode.ResourceNotFound, false);
            return next(error);
        }
        const isPasswordVerified = await existingUser.validatePassword(
            userInfo.password
        );

        if (!isPasswordVerified) {
            const error = new AppError("Invalid Password", responseCode.Invalid, false);
            return next(error);
        }
        const response = existingUser.toObject();

        delete response.password;

        const token = await existingUser.getJWT();
        const chatToken = await generateToken(existingUser);
        // res.cookie("token", token);
        res.status(200).json({
            success: true,
            msg: "login Successfully",
            data: {
                user: response,
                token,
                chatToken,
                streamApiKey: btoa(
                    process.env.STREAM_CHAT_API + process.env.ENCODE_SECRET
                ),
            }
        });
    } catch (err) {
        next(err);
    }
}