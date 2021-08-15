const { 
  UnauthorizedError, //401
  ForbiddenError, //403
} = require('../errors/errors');

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  if(!req.cookies.jwt) {
    throw new ForbiddenError('Необходима авторизация');
  } else {
    const token = req.cookies.jwt;

    let payload;

    try {
      payload = jwt.verify(token, 'super-duper-secret-key');
    } catch(err) {
      throw new UnauthorizedError('Ошибка верификации токена');
    }
    
    req.user = payload;
    next();
  }

}