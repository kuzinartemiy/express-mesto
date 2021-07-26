const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))

    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении списка пользователей.' }))
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(users => res.send({ data: users }))

    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании пользователя.' })
      }
    })
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar
  })
    .then(user => res.send({ data: user }))

    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при создании пользователя.' })
      }
    })
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.updateOne({_id: id}, {
    name,
    about
  })
    .then(user => res.send({ data: user }))
    
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      } else if(err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя.' })
      }
    })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  
  User.updateOne({_id: id}, {
    avatar
  })
    .then(user => res.send({ data: user }))
    
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' })
      } else if(err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя.' })
      }
    })
}