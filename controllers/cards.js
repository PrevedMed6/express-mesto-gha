/* eslint-disable comma-dangle */
const CardNotFoundError = require("../utils/CardNotFoundError");
const Card = require("../models/card");

const ERROR_CODE = 400;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при поиске карточки.",
          });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при поиске карточки.",
          });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) throw new CardNotFoundError();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        res.status(err.code).send({ message: err.message });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные для снятия лайка.",
        });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при поиске карточки.",
          });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};
