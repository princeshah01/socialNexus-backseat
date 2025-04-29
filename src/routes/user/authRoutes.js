const authRoutes = require("express").Router();
const authController = require("../../controllers/authController");
const { authUser } = require("../../middlewares/authMiddleWares");
const ValidateForgetPassword = require("../../middlewares/validateForgetpassword");

authRoutes.get("/login", authController.Login);
authRoutes.post("/signup", authController.signup);
authRoutes.post("/forget-password", authController.forgetpassword);
authRoutes.post(
  "/resend-otp",
  ValidateForgetPassword,
  authController.resendOTP
);
authRoutes.post(
  "/verify-otp",
  ValidateForgetPassword,
  authController.verifyOTP
);
authRoutes.post(
  "/reset-with-old-password",
  ValidateForgetPassword,
  authController.resetWithOldPassword
);
authRoutes.post(
  "/change-password",
  ValidateForgetPassword,
  authController.changePassword
);
authRoutes.patch("/logout", authUser, authController.logout);
module.exports = authRoutes;
