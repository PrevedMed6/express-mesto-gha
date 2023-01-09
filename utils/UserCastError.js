const errorCodes = require('./ErrorCodes');

module.exports = class UserCastError extends Error {
  constructor() {
    super();
    this.name = 'UserCastError';
    this.message = 'Переданы некорректные данные при поиске профиля.';
    this.code = errorCodes.BAD_REQUEST_ERROR;
  }
};
