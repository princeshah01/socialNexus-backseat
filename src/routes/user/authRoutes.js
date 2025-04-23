const authRoutes = require("express").Router();
const authController = require("../../controllers/authController")
authRoutes.get("/login", authController.Login);

module.exports = authRoutes;
