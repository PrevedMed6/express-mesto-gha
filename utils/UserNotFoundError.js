/* eslint-disable max-classes-per-file */
module.exports = class UserNotFoundError extends Error {
  constructor() {
    super();
    this.name = "UserNotFoundError";
    this.message = "Пользователь по указанному _id не найден.";
    this.code = 404;
  }
};
