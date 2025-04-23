function AppError(message, status, success) {
  this.message = message || "Something Went Wrong";
  this.status = status;
  this.stack = new Error().stack;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;
