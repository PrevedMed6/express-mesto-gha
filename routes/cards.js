const cards = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cards.delete("/cards/:cardId", deleteCard);
cards.get("/cards", getCards);
cards.post("/cards", createCard);
cards.put("/cards/:cardId/likes", likeCard);
cards.delete("/cards/:cardId/likes", dislikeCard);
module.exports = cards;
