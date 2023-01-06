const express = require("express");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  lengthCheck,
  validateName,
} = require("../helpers/validate");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const { sendVerificationMail } = require("../helpers/mailer");

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
      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationMail(user.email, user.first_name, url);
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        verified: user.verified,
        message: "register success!please activate your email",
      });
      // res.json({ msg: "register success", user: user });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  activateToken: async (req, res) => {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.SECRET_VERIFICATION_TOKEN);
    const isUser = await User.findById(user.id);
    if (isUser.verified === true) {
      return res.status(400).json({ message: "account is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "congratulations.your account is activated successfully.",
      });
    }
    console.log(user);
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    const isRegisteredUser = await User.findOne({ email: email });
    if (!isRegisteredUser) {
      return res.status(404).json({
        message:
          "there is no account in this email. please put the correct email. else try again with correct email. or register with given email",
      });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      isRegisteredUser.password
    );
    if (!isCorrectPassword) {
      return res.status(404).json({
        message: "invalid password. please try again with correct password",
      });
    }
    const token = generateToken({ id: isRegisteredUser._id.toString() }, "7d");
    res.send({
      id: isRegisteredUser._id,
      username: isRegisteredUser.username,
      picture: isRegisteredUser.picture,
      first_name: isRegisteredUser.first_name,
      last_name: isRegisteredUser.last_name,
      token,
      verified: isRegisteredUser.verified,
      message: "login successful",
    });
  },
};
module.exports = userController;
