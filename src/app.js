const express = require("express");
const config = require("./config");
const path = require("path");
const connectDB = require("./dbConnection");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// all the routers listed here

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
