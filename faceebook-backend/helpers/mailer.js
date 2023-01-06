const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;

const oauth_link = "https://developers.google.com/oauthplayground";

const { MAIL, REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET } = process.env;

const auth = new OAuth2(CLIENT_ID, REFRESH_TOKEN, CLIENT_SECRET, oauth_link);

exports.sendVerificationMail = (email, name, url) => {
  auth.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
  const accessToken = auth.getAccessToken();
  const smtp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: MAIL,
    to: email,
    subject: "Facebook email verification",
    html: ``,
  };
  smtp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};
