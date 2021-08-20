const jwt = require('jsonwebtoken');

const {
  UnauthorizedError, // 401
} = require('../errors/errors');

// module.exports = (req, res, next) => {
//   if (!req.cookies.jwt) {
//     throw new UnauthorizedError('Необходима авторизация');
//   } else {
//     const token = req.cookies.jwt;

//     let payload;

//     try {
//       payload = jwt.verify(token, 'super-duper-secret-key');
//     } catch (err) {
//       throw new UnauthorizedError('Ошибка верификации токена');
//     }

//     req.user = payload;
//     next();
//   }
// };

module.exports = (req, res, next) => {
  if (!req.cookies) {
    throw new UnauthorizedError('Необходима авторизация');
  } else {
    const { token } = req.cookies;

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
