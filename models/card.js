const mongoose = require('mongoose');
const REGEX_URL = require('../constants/regex');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return REGEX_URL.test(v);
      },
      message: `use valid url`,
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  likes: {
    type: mongoose.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', userSchema);
