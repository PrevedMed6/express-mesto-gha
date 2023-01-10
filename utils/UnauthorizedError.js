const errorCodes = require('./ErrorCodes');

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.message = message ?? 'Неправильные почта или пароль';
    this.code = errorCodes.UNAUTHORIZED_ERROR;
  }
};
