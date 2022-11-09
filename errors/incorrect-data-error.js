class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.name = IncorrectDataError;
    this.statusCode = 400;
  }
}

module.exports = IncorrectDataError;
