const NotFoundError = require('../utils/NotFoundError');

module.exports = (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
};
