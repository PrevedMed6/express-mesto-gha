/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const customErrors = require('./middlewares/errors');
const pageNotFound = require('./middlewares/pageNotFound');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['ru', 'com', 'net'] } }),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['ru', 'com', 'net'] } }),
      password: Joi.string().required().alphanum().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/', users);
app.use('/', cards);

app.use(pageNotFound);
app.use(errors());
app.use(customErrors);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
