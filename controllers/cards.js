const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})

    .then(cards => res.send({ data: cards }))

    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении списка карточек.' }))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  
  Card.create({
    name,
    link,
    owner: ownerId
  })

    .then(card => res.send({ data: card }))

    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка: Переданы некорректные данные.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании карточки.' })
      }
    })
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete({ _id: cardId })

    .then(card => {
      if(card) {
        res.send({ data: card })
      } else {
        res.status(404).send({ message: 'Карточка по указанному _id не найдена.' })
      }
    })
    
    .catch(err => {
      if(err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка валидации данных.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при удалении карточки.' })
      }
    })
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

  .then(card => {
    if(card) {
      res.send({ data: card })
    } else {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена.' })
    }
  })

  .catch(err => {
    if(err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки / снятии лайка.' })
    } else {
      res.status(500).send({ message: 'Произошла ошибка при постановке / снятии лайка.' })
    }
  })

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)

  .then(card => {
    if(card) {
      res.send({ data: card })
    } else {
      res.status(404).send({ message: 'Карточка по указанному _id не найдена.' })
    }
  })

  .catch(err => {
    if(err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки / снятии лайка.' })
    } else {
      res.status(500).send({ message: 'Произошла ошибка при постановке / снятии лайка.' })
    }
  })