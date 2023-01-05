const User = require("../models/User");

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d.]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.lengthCheck = (text, min, max) => {
  if (text.length <= min || text.length >= max) {
    return false;
  }
  return true;
};

exports.validateName = async (userName) => {
  let a = false;

  do {
    let check = await User.findOne({ username: userName });
    if (check) {
      userName += (+new Date() * Math.random()).toString().substring(0, 1);

      a = true;
    } else a = false;
  } while (a);
  return userName;
};
