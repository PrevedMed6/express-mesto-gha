const errorCodes = require('./ErrorCodes');

module.exports = class UserNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'UserNotFoundError';
    this.message = 'Пользователь по указанному _id не найден.';
    this.code = errorCodes.NOT_FOUND_ERROR;
  }
};
