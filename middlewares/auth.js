const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаем авторизованный заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key'); // верификация токена
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
