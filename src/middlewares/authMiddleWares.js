const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");
const authUser = async (req, res, next) => {
  try {
    const header = req?.headers?.authorization;
    if (!header) {
      throw new AppError("No Token Attached", responseCode.BadRequest, false);
    }
    const token = header.toString().split(" ")[1];
    if (!token) {
      throw new AppError(
        "Please Login To Access to these EndPoints",
        responseCode.Unauthorized,
        false
      );
    }
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!_id) {
      throw new AppError("Invalid Token", responseCode.BadRequest, false);
    }
    const loggedInUser = await User.findById(_id);
    if (!loggedInUser) {
      throw new AppError(
        "User not Found",
        responseCode.ResourceNotFound,
        false
      );
    }
    req.user = loggedInUser;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { authUser };
