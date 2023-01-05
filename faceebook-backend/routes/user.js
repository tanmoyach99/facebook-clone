const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/register", userController.register);

module.exports = userRouter;
