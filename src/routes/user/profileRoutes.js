const profileRoutes = require("express").Router();
const upload = require("../../middlewares/upload");
const profileController = require("../../controllers/profileController");
const { authUser } = require("../../middlewares/authMiddleWares");
profileRoutes.put("/setup", authUser, upload, profileController.setup);
profileRoutes.get("/view", authUser, profileController.view);
profileRoutes.put("/edit", authUser, upload, profileController.edit);
module.exports = profileRoutes;
