const infoRoutes = require("express").Router();

infoRoutes.get("/faq", async (req, res, next) => {
  res.send("faq");
});

module.exports = infoRoutes;
