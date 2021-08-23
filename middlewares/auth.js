const jwt = require('jsonwebtoken');

const {
  UnauthorizedError, // 401
} = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError({ message: req.cookies.jwt });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-duper-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Ошибка верификации токена');
  }

  req.user = payload;
  next();
};
