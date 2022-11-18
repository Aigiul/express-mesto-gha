const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_CODE } = require('./errors/status-codes');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.use((req, _res, next) => {
  req.user = {
    _id: '636bac683c6b4d64ded06402',
  };
  next();
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый путь не найден' });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
