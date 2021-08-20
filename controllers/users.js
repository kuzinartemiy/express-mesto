const jwt = require('jsonwebtoken');
// const validator = require('validator');
const bcrypt = require('bcrypt');

const {
  BadRequestError, // 400
  UnauthorizedError, // 401
  NotFoundError, // 404
  ConflictError, // 409
  ServerError, // 500
} = require('../errors/errors');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})

    .then((users) => {
      if (!users) {
        throw new ServerError({ message: 'Произошла ошибка при получении списка пользователей.' });
      }

      res.send(users);
    })

    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })

    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми.');
  }

  User.findOne({ email })

    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким Email уже существует.');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              email,
              password: hash,
              name,
              about,
              avatar,
            })
              .then((newUser) => {
                if (!newUser) {
                  throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
                }
                res.status(201).send(newUser);
              })

              .catch(next);
          });
      }
    })

    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    { _id: id },
    { name, about },
    { new: true },
  )

    .then((user) => {
      if (!user) {
        throw new BadRequestError('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })

    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    { _id: id },
    { avatar },
    { new: true },
  )

    .then((user) => {
      if (!user) {
        throw new BadRequestError('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })

    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми.');
  }

  User.findOne({ email }).select('+password')

    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователя не существует.');
      } else {
        bcrypt.compare(password, user.password)

          .then((isValid) => {
            if (!isValid) {
              throw new UnauthorizedError('Неправильный пароль.');
            } else {
              const token = jwt.sign({ _id: user._id }, 'super-duper-secret-key');
              res
                .cookie('jwt', token, {
                  maxAge: '1w',
                })
                .status(200).send({ token });
            }
          })

          .catch(next);
      }
    })

    .catch(next);
};

module.exports.getAuthorizedUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      res.send(user);
    })

    .catch(next);
};
