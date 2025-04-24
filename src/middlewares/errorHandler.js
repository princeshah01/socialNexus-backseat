const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please login again.", 401, false);
  } else if (err.name === "TokenExpiredError") {
    err = new AppError("Token has expired. Please login again.", 401, false);
  }
  if (err.name === "ValidationError") {
    // Get the first validation error message
    err = new AppError(Object.values(err.errors)[0].message, 400, false);
  }
  if (!(err instanceof AppError)) {
    err = new AppError(err.message || "Internal Server Error", 500, false);
  }
  res.status(err.status || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
