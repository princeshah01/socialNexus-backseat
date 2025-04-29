const { authUser } = require("../../middlewares/authMiddleWares");
const connectionRoutes = require("express").Router();
const connectionController = require("../../controllers/connectionController");
connectionRoutes.get("/view", authUser, connectionController.view);
connectionRoutes.delete(
  "/remove/:connectionId",
  authUser,
  connectionController.remove
);

module.exports = connectionRoutes;
