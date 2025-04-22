const requestRoutes = require("express").Router();

requestRoutes.get("/view", async (req, res, next) => {
  res.send("from request");
});

module.exports = requestRoutes;
