const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(bodyParser.json());
// eslint-disable-next-line max-len
app.use(bodyParser.urlencoded({ extended: true })); // -подключаем мидлвар, чтобы парсить в запросе json

mongoose.connect(MONGO_URL);

app.use((req, _res, next) => {
  req.user = {
    _id: '636bac683c6b4d64ded06402',
  };
  next();
});

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
