const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const NoPrivilegiesError = require('../utils/NoPrivilegiesError');
const errorNames = require('../utils/ErrorNames');

const VALIDATION_ERROR_TEXT = 'Переданы некорректные данные при создании карточки';
const NOT_FOUND_ERROR_TEXT = 'Карточка с указанным _id не найдена';
const CAST_ERROR_TEXT = 'Переданы некорректные данные при поиске карточки';

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === errorNames.VALIDATION_ERROR_NAME) {
        next(new BadRequestError(VALIDATION_ERROR_TEXT));
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
      if (!card) throw new NoPrivilegiesError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
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
      if (!card) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === errorNames.CAST_ERROR_NAME) {
        next(new BadRequestError(CAST_ERROR_TEXT));
      }
      next(err);
    });
};
