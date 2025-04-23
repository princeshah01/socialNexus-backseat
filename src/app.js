const express = require("express");
const path = require("path");
const connectDB = require("./dbConnection");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config()

// importing routers

const authRoutes = require("./routes/user/authRoutes");
const profileRoutes = require("./routes/user/profileRoutes");
const requestRoutes = require("./routes/user/requestRoutes");
const connectionRoutes = require("./routes/user/connectionRoutes");
const infoRoutes = require("./routes/user/infoRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// all the routers listed here
app.use("/api/user/auth", authRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/user/requests", requestRoutes);
app.use("/api/user/connections", connectionRoutes);
app.use("/api/user/info", infoRoutes);
// app.use("/api/user/notifications", notificationRoutes);
// app.use("/api/user/avatar", avatarRoutes);
// app.use("/api/user/toggle-is-fav", toggleFavRoutes);
// app.use("/api/user/feed", feedRoutes);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(errorHandler);
(async function () {
  try {
    await connectDB();
    console.log("DataBase Connected");
    app.listen(8000, () => {
      console.log("server is listining on port number http://localhost:8000");
    });
  } catch (error) {
    console.log(error, "unable to Listen Request");
  }
})();
