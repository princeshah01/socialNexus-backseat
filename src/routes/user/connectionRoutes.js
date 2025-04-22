const connectionRoutes = require("express").Router();

connectionRoutes.get("/view", async (req, res) => {
  res.send("from connection request");
});

module.exports = connectionRoutes;
