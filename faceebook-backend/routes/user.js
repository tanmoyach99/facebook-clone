const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/user", userController.home);

module.exports = userRouter;
