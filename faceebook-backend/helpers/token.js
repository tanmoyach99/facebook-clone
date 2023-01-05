const jwt = require("jsonwebtoken");

exports.generateToken = (credentials, expires) => {
  return jwt.sign(credentials, process.env.SECRET_VERIFICATION_TOKEN, {
    expiresIn: expires,
  });
};
