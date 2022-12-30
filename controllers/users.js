const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorCodes = require('../utils/ErrorCodes');
const UserNotFoundError = require('../utils/UserNotFoundError');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then(hash => User.create({
    name,
    about,
    avatar,
    email,
    password:hash,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new UserNotFoundError();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при поиске профиля.',
        });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res
      .status(errorCodes.DEFAULT_ERROR)
      .send({ message: 'Произошла ошибка' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new UserNotFoundError();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
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
      if (!user) throw new UserNotFoundError();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при поиске профиля.',
        });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
      if (!user) throw new UserNotFoundError();
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(errorCodes.BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при поиске профиля.',
        });
        return;
      }
      res
        .status(errorCodes.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};


