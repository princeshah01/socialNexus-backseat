const authRoutes = require("express").Router();

authRoutes.get("/login", async (req, res, next) => {
  res.send("hi");
});

module.exports = authRoutes;
