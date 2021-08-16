const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCard);
router.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), dislikeCard);

module.exports = router;
