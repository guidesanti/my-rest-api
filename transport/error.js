function Error(code, message, cause, meta) {
    this.code = code;
    this.message = message;
    this.cause = cause || undefined;
    this.meta = meta || undefined;
  }
  
  Error.prototype.toString = function () {
    return JSON.stringify(this);
  }
  
  module.exports = Error;