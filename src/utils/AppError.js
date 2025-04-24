function AppError(
  message = "Something Went Wrong",
  status = 500,
  success = false
) {
  this.name = "AppError";
  this.message = message;
  this.status = status;
  this.success = success;
  Error.captureStackTrace(this, this.constructor);
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;
