const errorCodes = require('./ErrorCodes');

module.exports = class NoPrivilegiesError extends Error {
  constructor() {
    super();
    this.name = 'NoPrivilegiesError';
    this.message = 'Недостаточно прав на совершение действия';
    this.code = errorCodes.NO_PRIVILEGIES;
  }
};
