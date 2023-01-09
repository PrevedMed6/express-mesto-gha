const PageNotFoundError = require('../utils/PageNotFoundError');

module.exports = (req, res, next) => {
  next(new PageNotFoundError());
};
