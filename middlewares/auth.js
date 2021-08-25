const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  UnauthorizedError, // 401
} = require('../errors/errors');

function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Ошибка авторизации: не найден req.cookies.jwt');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Ошибка верификации токена');
  }

  req.user = payload;
  next();
}

module.exports = {
  auth,
};
