const { authUser } = require("../../middlewares/authMiddleWares");
const connectionRoutes = require("express").Router();
const connectionController = require("../../controllers/connectionController");
connectionRoutes.get("/view", authUser, connectionController.view);

module.exports = connectionRoutes;
