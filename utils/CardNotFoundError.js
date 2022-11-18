module.exports = class CardNotFoundError extends Error {
  constructor() {
    super();
    this.name = "CardNotFoundError";
    this.message = "Карточка с указанным _id не найдена.";
    this.code = 404;
  }
};
