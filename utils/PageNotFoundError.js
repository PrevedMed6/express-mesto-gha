const errorCodes = require('./ErrorCodes');

module.exports = class PageNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'PageNotFoundError';
    this.message = 'Страница не найдена';
    this.code = errorCodes.NOT_FOUND_ERROR;
  }
};
