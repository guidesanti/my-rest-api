function Response(data, errors, meta) {
    this.data = data || undefined;
    if (Array.isArray(errors)) {
      this.errors = errors;
    } else if (errors) {
      this.errors = [
        errors
      ]
    }
    this.meta = meta || undefined;
  }
  
  Response.prototype.toString = function () {
    return JSON.stringify(this);
  }
  
  module.exports = Response;