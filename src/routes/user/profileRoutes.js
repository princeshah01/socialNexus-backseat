const profileRoutes = require("express").Router();

profileRoutes.get("/setup", async (req, res, next) => {
  res.send("hello");
});

module.exports = profileRoutes;
