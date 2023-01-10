const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

users.get('/users/me', getCurrentUser);
users.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
);
users.get('/users', getUsers);
users.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
users.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9/\-._~:?#[\]@!$&'()*+,;=]*)#?$/,
      ),
    }),
  }),
  updateUserAvatar,
);
module.exports = users;
