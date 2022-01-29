const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUser, login } = require('./controllers/users');
const ResourceNotFoundErr = require('./errors/resourceNotFound');

const { PORT = 3000 } = process.env;
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/newsExplorer');
// mongoose.connect('mongodb+srv://hasmik:henry@cluster0.24mr2.mongodb.net/newsExplorer?retryWrites=true&w=majority');

const app = express();

app.use(express.json());

app.use(cors());
app.options('*', cors());

const usersRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

app.use(requestLogger); // enabling the request logger. when making a request to the server, the request.log file will be created
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
    username: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(usersRoutes);
app.use(articlesRoutes);

app.use((req, res, next) => {
  next(new ResourceNotFoundErr('resource not found'));
});

app.use(errorLogger); // enabling the error logger,If an error occurs on the server, the error.log file will be created

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).send({ name: err.name, message: err.message });
  //  );
});

app.listen(PORT);
