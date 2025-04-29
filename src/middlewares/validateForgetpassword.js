const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");
const User = require("../models/User");
const ValidateForgetPassword = async (req, _, next) => {
  try {
    const header = req?.headers?.authorization;
    if (!header) {
      throw new AppError(
        "unauthorized access denied",
        responseCode.Unauthorized
      );
    }
    let token = header.split(" ")[1];
    if (!token) {
      throw new AppError("No token Found", responseCode.BadRequest);
    }
    const { _id } = await jwt.verify(
      token,
      process.env.JWT_FORGETPASSWORD_VERIFY
    );
    if (!_id) {
      throw new AppError("Invalid credintials");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new AppError("no user found", responseCode.ResourceNotFound);
    }
    req.user = user.email;
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = ValidateForgetPassword;
