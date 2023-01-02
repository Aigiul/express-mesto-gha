const { ERROR_CODE } = require('./status-codes');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE;
  }
}

module.exports = BadRequest;
