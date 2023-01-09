const CardNotFoundError = require('../utils/CardNotFoundError');
const Card = require('../models/card');
const CardValidationError = require('../utils/CardValidationError');
const CardCastError = require('../utils/CardCastError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CardValidationError());
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
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError());
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError());
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CardCastError());
      }
      next(err);
    });
};
