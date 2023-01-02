const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const BadRequest = require('../errors/badRequest');
const UnauthorizedError = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив кусто',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: true,
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // - уникальность
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequest({ message: 'Некорректный email' });
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false, // отключение версионирования в монгузе ("__v": 0)
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Необходима авторизация'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Необходима авторизация'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
