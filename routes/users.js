const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');

// const auth = require('../middlewares/auth');

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

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
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
