const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const cookieParser = require('cookie-parser');

const app = express();

const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(404).send('404 Error');
});

app.use((err, req, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: 'Ошибка валидации.' });
  }

  if (!err.statusCode) {
    return res.status(500).send({ message: 'На сервере произошла ошибка.' });
  }

  return res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`I'm running on ${PORT}`);
});
