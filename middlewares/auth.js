const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../errors/status-codes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаем авторизованный заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key'); // верификация токена
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};