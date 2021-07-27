const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '60fe3ee5fbc51b330ca7dfd6'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(function (req, res, next) {
  res.status(404).send("404 Error");
})

app.listen(PORT, () => {
	console.log(`I'm running on ${PORT}`);
})