const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { INTERNAL_SERVER_ERROR } = require('./errors/status-codes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errors, Joi, celebrate } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

// роуты не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

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
