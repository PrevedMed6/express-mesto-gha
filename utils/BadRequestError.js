const errorCodes = require('./ErrorCodes');

module.exports = class ValidationError extends Error {
  constructor(message) {
    super();
    this.name = 'ValidationError';
    this.message = message ?? 'Переданы некорректные данные';
    this.code = errorCodes.BAD_REQUEST_ERROR;
  }
};
