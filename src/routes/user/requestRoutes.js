const requestRoutes = require("express").Router();
const { authUser } = require("../../middlewares/authMiddleWares");
const requestController = require("../../controllers/requestController");

// endpoints

requestRoutes.get("/received", authUser, requestController.received);
requestRoutes.post("/send/:status/:toUserId", authUser, requestController.send);
requestRoutes.put(
  "/review/:status/:requestId",
  authUser,
  requestController.review
);

module.exports = requestRoutes;
