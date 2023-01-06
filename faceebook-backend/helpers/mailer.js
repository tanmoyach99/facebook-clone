const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;

const oauth_link = "https://developers.google.com/oauthplayground";

const { MAIL, REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET } = process.env;

const auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, oauth_link);

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
    html: `<body style="margin: 20px"> <div style=" padding: 2rem 0; display: flex; align-items: center; font: Roboto, sans-serif; " > <img style="width: 3rem" src="https://res.cloudinary.com/dvzn2mpvu/image/upload/v1672988220/facebook_reemzs.png" alt="" /> <span style="margin-left: 5px" >Action Require: You Have to activate your Account</span > </div> <div style=" padding: 1rem 0; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 17px; " > <span>Hello ${name}</span> <div style="padding: 20px 0"> <span style="padding: 1.5rem 0"> You Recently created your account on facebook. To complete your registration, you have to activate your account </span> </div> <a href=${url} style=" width: 200px; padding: 13px; background-color: #1877f2; color: white; text-decoration: none; margin-top: 10px; font-size: 1rem; text-transform: uppercase; font-weight: 300; " > confirm your account</a > </div> <br /> <div> <span style="color: gray; text-transform: capitalize"> facebook allows you to stay in touch with all your friends.once registered account on facebook you can share your photos,activities, manage events and much more </span> </div> </body>`,
  };
  smtp.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);

      return err;
    }
    console.log(res);
    return res;
  });
};
