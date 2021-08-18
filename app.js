const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { Joi, celebrate } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { NotFoundError, BadRequestError } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Невалидный URL');
    }),
  }),
}), createUser);

app.use(() => {
  throw new NotFoundError('404 Error');
});

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).send({ message: message || 'Произошла ошибка на сервере.' });
  return next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`I'm running on ${PORT}`);
});
