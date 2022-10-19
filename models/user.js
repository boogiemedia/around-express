const mongoose = require('mongoose');
const REGEX_URL = require('../constants/regex')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>{
        return REGEX_URL.test(v)
      },
      message: `use valid url`
    }
  }
})

module.exports = mongoose.model('user', userSchema)