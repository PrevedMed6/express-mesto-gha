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
const dotEnvConsts = require('./utils/DotEnvConsts');

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
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9/\-._~:?#[\]@!$&'()*+,;=]*)#?$/,
      ),
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

mongoose.connect(dotEnvConsts.SERVER_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
