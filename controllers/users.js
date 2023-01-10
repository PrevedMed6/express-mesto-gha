const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorNames = require('../utils/ErrorNames');
const NotFoundError = require('../utils/NotFoundError');
const UnauthorizedError = require('../utils/UnauthorizedError');
const BadRequestError = require('../utils/BadRequestError');
const UserDuplicateError = require('../utils/UserDuplicateError');
const User = require('../models/user');

const VALIDATION_ERROR_TEXT =
  'Переданы некорректные данные при создании профиля';
const NOT_FOUND_ERROR_TEXT = 'Пользователь по указанному _id не найден';
const CAST_ERROR_TEXT = 'Переданы некорректные данные при поиске профиля';

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
        next(new BadRequestError(VALIDATION_ERROR_TEXT));
      }
      next(err);
    }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
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
      if (!user) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
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
      if (!user) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === errorNames.VALIDATION_ERROR_NAME) {
        next(new BadRequestError(VALIDATION_ERROR_TEXT));
      }
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
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
      if (!user) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === errorNames.VALIDATION_ERROR_NAME) {
        next(new BadRequestError(VALIDATION_ERROR_TEXT));
      }
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'c7c10cc91cc20870e038950e9928a8fba0c38d76b582e3ec61522953117bc151',
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(() => {
      next(new UnauthorizedError());
    });
};
