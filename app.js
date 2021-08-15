const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const { login, createUser } = require('./controllers/users');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.post('/signin', login);
app.post('/signup', createUser);

app.use(function (req, res, next) {
  res.status(404).send("404 Error");
})

app.use((err, req, res, next) => {

  if(err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: 'Ошибка валидации.' })
  }
  
  if(!err.statusCode) {
    return res.status(500).send({ message: 'На сервере произошла ошибка.' })
  }

  res.status(err.statusCode).send({ message: err.message })
})

app.listen(PORT, () => {
	console.log(`I'm running on ${PORT}`);
})