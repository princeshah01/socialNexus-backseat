const authRoutes = require("express").Router();
const authController = require("../../controllers/authController");
authRoutes.get("/login", authController.Login);
authRoutes.post("/signup", authController.signup);
authRoutes.post("/forget-password", authController.forgetpassword);
authRoutes.post("/resend-otp", authController.resendOTP);
authRoutes.post("/verify-otp", authController.verifyOTP);
authRoutes.post(
  "/reset-with-old-password",
  authController.resetWithOldPassword
);
authRoutes.post("/change-password", authController.changePassword);

module.exports = authRoutes;
