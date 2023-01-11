const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const NoPrivilegiesError = require('../utils/NoPrivilegiesError');
const errorNames = require('../utils/ErrorNames');
const errorTexts = require('../utils/ErrorTexts');

function updateLike(cardId, params, options) {
  return Card.findByIdAndUpdate(cardId, params, options)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError(errorTexts.NOT_FOUND_ERROR_TEXT));
      }
      return card;
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        return Promise.reject(new BadRequestError(errorTexts.CAST_ERROR_TEXT));
      }
      return Promise.reject(err);
    });
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === errorNames.VALIDATION_ERROR_NAME) {
        next(new BadRequestError(errorTexts.VALIDATION_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({
    _id: req.params.cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorTexts.NOT_FOUND_ERROR_TEXT);
      }
      Card.findOneAndDelete({
        _id: req.params.cardId,
        owner: req.user._id,
      })
        .then((delCard) => {
          if (!delCard) throw new NoPrivilegiesError();
          res.send({ data: delCard });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(errorTexts.CAST_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  updateLike(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  updateLike(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};
