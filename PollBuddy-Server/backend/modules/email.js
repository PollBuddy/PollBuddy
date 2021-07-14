// This email system was built with the help of the following tutorial:
// https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

const emailSigHTML =
  "<br /><br /> -- " +
  "<br />This message was sent via an automated system at <a href='https://pollbuddy.app'>pollbuddy.app</a>." +
  "<br />A reply is not guaranteed at this address." +
  "<br />Please direct any questions/comments/concerns to <a href='mailto:help@pollbuddy.app'>help@pollbuddy.app</a>." +
  "<br />Thank you for using Poll Buddy!" +
  "<br /><img src='https://github.com/PollBuddy/Resources/raw/main/Branding/Poll%20Buddy%20Logo.png' width='240px' alt='Poll Buddy Logo'/>";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var oauth2Client;
var accessToken;
var smtpTransport;
var enabled;

module.exports = {

  // This function sets up the emailing system (or not if the env variables aren't set)
  initialize: function() {
    // Test to make sure all the env details have been provided before enabling the email system.
    if(process.env.EMAIL_ADDRESS_INTERNAL === "NONE" || process.env.EMAIL_ADDRESS_EXTERNAL === "NONE" ||
      process.env.EMAIL_CLIENT_ID === "NONE" || process.env.EMAIL_CLIENT_SECRET === "NONE" ||
      process.env.EMAIL_REFRESH_TOKEN === "NONE") {
      console.log("Email system is not configured, emails will be logged to the console instead of sent.");
      enabled = false;
      return;
    } else {
      console.log("Email system is configured, emails will be sent and the event logged.");
      enabled = true;
    }

    // Details about the account/OAuth used for sending emails
    oauth2Client = new OAuth2(
      process.env.EMAIL_CLIENT_ID,
      process.env.EMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    // Refresh token to get a valid access token
    oauth2Client.setCredentials({
      // eslint-disable-next-line camelcase
      refresh_token: process.env.EMAIL_REFRESH_TOKEN
    });
    accessToken = oauth2Client.getAccessToken();

    // Configure nodemailer for sending mails through GMail
    smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS_INTERNAL,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: accessToken
      }
    });
  },

  // To use this function, call it with your destination email address (such as "user@domain.com"), your subject
  // (such as "Password Reset Confirmation"), the email body (such as "Click this link to reset your password",
  // HTML tags are supported, the signature at the top of the file will be appended), and a callback function
  // that accepts a boolean success value and a messages object with error messages or success messages as relevant.
  // Omitting the callback function will ignore any results.
  // If the email system is not configured via the .env file, messages will be logged to console and always succeed.
  // eslint-disable-next-line no-unused-vars
  send: async function (destination, subject, body, callback = function(success, messages){}) {

    if(enabled) {
      // Create our email
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS_EXTERNAL,
        to: destination,
        subject: subject,
        generateTextFromHTML: true,
        html: body + emailSigHTML
      };

      // Send the email
      smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          callback(false, error);
        } else {
          callback(true, response);
        }
        smtpTransport.close();
      });
      console.log("Email sent to " + destination + ", subject: " + subject);
    } else {
      console.log("Email NOT sent to " + destination + ", subject: " + subject + ", body: " + body + emailSigHTML);
      callback(true, "Email sent to console");
    }
  }

};