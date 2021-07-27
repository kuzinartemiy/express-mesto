const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  
    .then(users => res.send({ data: users }))

    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении списка пользователей.' }))
}

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)

    .then(user => {
      if(user) {
        res.send({ data: user })
      } else {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
      }
    })

    .catch(err => {
      if(err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка валидации, данные не найдены.' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка при поиске пользователя.' })
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

    .catch(err => {
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

  User.findByIdAndUpdate(
    { _id: id }, 
    { name, about },
    { new: true, runValidators: true })

      .then(user => {
        if(user) {
          res.send({ data: user })
        } else {
          res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
        }
      })
      
      .catch(err => {
        if(err.name === 'CastError') {
          res.status(400).send({ message: 'Ошибка валидации, данные не найдены.' })
        } else {
          res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя.' })
        }
      })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    { _id: id }, 
    { avatar },
    { new: true, runValidators: true })

      .then(user => {
        if(user) {
          res.send({ data: user })
        } else {
          res.status(404).send({ message: 'Пользователь по указанному _id не найден.' })
        }
      })
      
      .catch(err => {
        if(err.name === 'CastError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' })
        } else {
          res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя.' })
        }
      })
}