const Article = require('../models/article');
const ValidationError = require('../errors/ValidationErr');

const articleNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .orFail(() => articleNotFoundHandler())
    .then((articles) => res.status(200).send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    date,
    text,
    source,
    link,
    image,
  } = req.body;
  const owner = req.user._id; // not sure yet
  Article.create({
    keyword,
    title,
    date,
    text,
    source,
    link,
    image,
    owner,
  })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .orFail(() => articleNotFoundHandler())
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        Article.findByIdAndDelete(articleId)
          .orFail(() => articleNotFoundHandler())
          .then((article) => res.status(201).send(article))
          .catch(next);
      } else {
        throw new ValidationError('Forbidden');
      }
    })
    .catch(next);
};
