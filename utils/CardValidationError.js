const errorCodes = require('./ErrorCodes');

module.exports = class CardValidationError extends Error {
  constructor() {
    super();
    this.name = 'CardValidationError';
    this.message = 'Переданы некорректные данные при создании карточки.';
    this.code = errorCodes.BAD_REQUEST_ERROR;
  }
};
