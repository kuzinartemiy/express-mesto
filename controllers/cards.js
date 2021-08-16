const {
  BadRequestError, // 400
  ForbiddenError, // 403
  NotFoundError, // 404
  ServerError, // 500
} = require('../errors/errors');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})

    .then((cards) => {
      if (!cards) {
        throw new ServerError({ message: 'Произошла ошибка при получении списка карточек.' });
      }

      res.send(cards);
    })

    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({
    name,
    link,
    owner: ownerId,
  })

    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }

      res.status(201).send(card);
    })

    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }

      const ownerId = card.owner.toString();

      if (ownerId !== userId) {
        throw new ForbiddenError('Авторизованный пользователь не является хозяином карточки.');
      } else {
        Card.deleteOne({ _id: cardId })

          .then((deletedCard) => {
            res.send(deletedCard);
          })

          .catch(next);
      }
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      }

      res.send(card);
    })

    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      }

      res.send(card);
    })

    .catch(next);
};
