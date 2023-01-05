const express = require("express");
const {
  validateEmail,
  lengthCheck,
  validateName,
} = require("../helpers/validate");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");

const userController = {
  register: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        username,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
      } = req.body;
      if (!validateEmail(email)) {
        return res
          .status(400)
          .json({ msg: "This email is not Valid.Enter a valid email address" });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        return res.status(400).json({
          msg: "This email is already exists. Try with different email address",
        });

      if (!lengthCheck(first_name, 3, 30)) {
        return res.status(400).json({
          msg: "first name should be between 3 to 30 characters",
        });
      }

      if (!lengthCheck(last_name, 3, 30)) {
        return res.status(400).json({
          msg: "last name should be between 3 to 30 characters",
        });
      }

      if (!lengthCheck(password, 6, 50)) {
        return res.status(400).json({
          msg: "password should be more than 6 characters",
        });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      let concatName = first_name + " " + last_name;
      let newName = await validateName(concatName);

      const user = await new User({
        first_name,
        last_name,
        username: newName,
        email,
        password: hashPassword,
        bYear,
        bMonth,
        bDay,
        gender,
      }).save();
      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "30m"
      );
      console.log(emailVerificationToken);
      res.json({ msg: "register success", user: user });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = userController;
