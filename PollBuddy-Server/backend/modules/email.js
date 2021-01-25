const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Details about the account/OAuth used for sending emails
const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

// Refresh token to get a valid access token
oauth2Client.setCredentials({
  // eslint-disable-next-line camelcase
  refresh_token: process.env.EMAIL_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

// Configure nodemailer for sending mails through GMail
const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "pollbuddy.app@gmail.com",
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    accessToken: accessToken
  }
});



module.exports = {

  send: function (destination, subject, body) {
    // Create our email
    const mailOptions = {
      from: "pollbuddy.app@gmail.com",
      to: destination,
      subject: subject,
      generateTextFromHTML: true,
      html: body
    };

    // Send the email
    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
  }

};