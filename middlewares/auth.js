const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(
      token,
      'c7c10cc91cc20870e038950e9928a8fba0c38d76b582e3ec61522953117bc151',
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
