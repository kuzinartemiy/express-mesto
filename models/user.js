const mongoose = require('mongoose');

const userChema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },

  avatar: {
    type: String,
    validate: {
      validator: function(v) {
        return /https?:\/\/(www)?[\-\.~:\/\?#\[\]@!$&'\(\)*\+,;=\w]+#?\b/gi.text(v)
      }
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  }
})

module.exports = mongoose.model('user', userChema);