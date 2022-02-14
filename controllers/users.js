const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config(); // After that, environment variables from this file will appear in process.env:

const { NODE_ENV, JWT_SECRET } = process.env;

const userNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

const emailAlreadyExists = () => {
  const error = new Error('choose another email');
  error.statusCode = 409;
  error.name = 'UserExists';
  throw error;
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id; // req.user is payload
  User.find({ _id: id })
    .orFail(() => userNotFoundHandler())
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return emailAlreadyExists();
      }
      return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email,
          name,
          password: hash,
        })
          .then((user) => {
            const {
              name,
              about,
              avatar,
              email,
              _id,
            } = user;
            res.status(201).send({
              name,
              about,
              avatar,
              email,
              _id,
            });
          }));
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
