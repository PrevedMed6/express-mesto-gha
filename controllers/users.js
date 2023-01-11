const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorNames = require('../utils/ErrorNames');
const errorTexts = require('../utils/ErrorTexts');
const dotEnvConsts = require('../utils/DotEnvConsts');
const NotFoundError = require('../utils/NotFoundError');
const UnauthorizedError = require('../utils/UnauthorizedError');
const BadRequestError = require('../utils/BadRequestError');
const UserDuplicateError = require('../utils/UserDuplicateError');
const User = require('../models/user');

function updateUser(userId, fields, options) {
  return User.findByIdAndUpdate(userId, fields, options).then((user) => {
    if (!user) {
      return Promise.reject(new NotFoundError(errorTexts.NOT_FOUND_ERROR_TEXT));
    }
    return user;
  }).catch((err) => {
    if (err.name === errorNames.VALIDATION_ERROR_NAME) {
      return Promise.reject(new BadRequestError(errorTexts.VALIDATION_ERROR_TEXT));
    }
    if (err.name === errorNames.CAST_ERROR_NAME) {
      return Promise.reject(new BadRequestError(errorTexts.CAST_ERROR_TEXT));
    }
    return Promise.reject(err);
  });
}

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserDuplicateError());
      }
      if (err.name === errorNames.VALIDATION_ERROR_NAME) {
        next(new BadRequestError(errorTexts.VALIDATION_ERROR_TEXT));
      }
      next(err);
    }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError(errorTexts.NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(errorTexts.CAST_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError(errorTexts.NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, dotEnvConsts.SECRET_KEY);
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({
          message: 'Авторизация успешна',
        })
        .end();
    })
    .catch(() => {
      next(new UnauthorizedError());
    });
};
