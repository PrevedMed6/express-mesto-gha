const users = require("express").Router();
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

users.get("/users/:userId", getUser);
users.get("/users", getUsers);
users.post("/users", createUser);
users.patch("/users/me", updateUser);
users.patch("/users/me/avatar", updateUserAvatar);
module.exports = users;
