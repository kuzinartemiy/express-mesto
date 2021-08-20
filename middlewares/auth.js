const jwt = require('jsonwebtoken');

const {
  UnauthorizedError, // 401
} = require('../errors/errors');

module.exports = (req, res, next) => {
  if (!res.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  } else {
    const token = res.cookies.jwt;

    let payload;

    try {
      payload = jwt.verify(token, 'super-duper-secret-key');
    } catch (err) {
      throw new UnauthorizedError('Ошибка верификации токена');
    }

    req.user = payload;
    next();
  }
};
