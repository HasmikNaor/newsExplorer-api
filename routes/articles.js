const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getArticles,
  deleteArticle,
  createArticle,

} = require('../controllers/article');

const router = express.Router();

router.use(bodyParser.json()); // parses data in JSON format
router.use(bodyParser.urlencoded({ extended: true })); // parses webpages inside POST requests

const validateURL = (value, helpers) => {
  console.log('validateurl');
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    link: Joi.string().required(),
  }).unknown(true),
}), createArticle);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }).unknown(true),
}), deleteArticle);

module.exports = router;
