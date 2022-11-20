/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3001 } = process.env;
const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '636815419ec47a7ec4d70859',
  };

  next();
});
app.use(express.json());
app.use('/', users);
app.use('/', cards);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
