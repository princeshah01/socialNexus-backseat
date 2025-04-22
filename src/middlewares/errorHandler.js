const errorHandler = (err, req, res, next) => {
  res.status(err.code || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
