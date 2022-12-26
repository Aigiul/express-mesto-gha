const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { INTERNAL_SERVER_ERROR } = require('./errors/status-codes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

// роуты не требующие авторизации
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth); // авторизация

//роуты, которым нужна авторизация
app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый путь не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
