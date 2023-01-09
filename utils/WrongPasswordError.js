const errorCodes = require('./ErrorCodes');

module.exports = class WrongPasswordError extends Error {
  constructor() {
    super();
    this.name = 'WrongPasswordError';
    this.message = 'Неправильные почта или пароль';
    this.code = errorCodes.UNAUTHORIZED_ERROR;
  }
};
