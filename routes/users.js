const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  BadRequestError,
} = require('../errors/errors');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getAuthorizedUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);

router.get('/me', auth, getAuthorizedUser);

router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), getUserById);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Невалидный URL');
    }),
  }),
}), updateAvatar);

module.exports = router;
