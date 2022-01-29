const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: { //  the word by which the articles are searched
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?.{1,}\.+\/?(.+)?#?/.test(v);
      },
      message: 'not valid address',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?.{1,}\.+\/?(.+)?#?/.test(v);
      },
      message: 'not valid address',
    },
  },
});

module.exports = mongoose.model('article', articleSchema);
