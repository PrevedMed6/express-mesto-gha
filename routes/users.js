const users = require('express').Router();
const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

users.get('/users/me', getCurrentUser);
users.get('/users/:userId', getUser);
users.get('/users', getUsers);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateUserAvatar);
module.exports = users;
