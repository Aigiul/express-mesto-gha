const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');


router.get('/users', getUsers);

router.get('/users/me', getUserInfo);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);


router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
  }),
}), updateAvatar);

module.exports = router;
