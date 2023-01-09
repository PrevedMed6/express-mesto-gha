const errorCodes = require('./ErrorCodes');

module.exports = class UserValidationError extends Error {
  constructor() {
    super();
    this.name = 'UserValidationError';
    this.message = 'Переданы некорректные данные при создании или редактировании пользователя.';
    this.code = errorCodes.BAD_REQUEST_ERROR;
  }
};
