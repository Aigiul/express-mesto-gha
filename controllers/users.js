const User = require('../models/user');
// eslint-disable-next-line no-unused-vars
const IncorrectDataError = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail((err) => {
      if (err.name === NotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === IncorrectDataError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя. ' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
      avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === IncorrectDataError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } if (err.name === NotFoundError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === IncorrectDataError) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } if (err.name === NotFoundError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
