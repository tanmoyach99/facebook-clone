const express = require("express");

const userController = {
  home: (req, res) => {
    res.send("welcome from user...........................................");
  },
};
module.exports = userController;
