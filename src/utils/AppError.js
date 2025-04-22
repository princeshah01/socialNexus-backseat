function AppError(message, code, success) {
  this.message = message || "Something Went Wrong";
  this.code = code;
  this.stack = new Error().stack;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;
