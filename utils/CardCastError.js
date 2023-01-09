const errorCodes = require('./ErrorCodes');

module.exports = class CardCastError extends Error {
  constructor() {
    super();
    this.name = 'CardCastError';
    this.message = 'Переданы некорректные данные при поиске карточки.';
    this.code = errorCodes.BAD_REQUEST_ERROR;
  }
};
