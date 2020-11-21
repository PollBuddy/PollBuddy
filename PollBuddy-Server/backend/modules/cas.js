const CASAuthentication = require('cas-authentication');
const User = require('../routes/users');
const schoolList = require("./schoolList");

schoolList.append("RPI");

const cas = new CASAuthentication({
  cas_url: process.env.CAS_URL || 'https://cas-auth.rpi.edu/cas',
  service_url: process.env.CAS_SERVICE_URL || "http://localhost:7655",
  cas_version: '3.0',
  renew: false
});

module.exports = {
  bounce: cas.bounce,
  bounce_redirect: cas.bounce_redirect,
  block: cas.block,
  logout: cas.logout,
  // Bounce user to RPI's login page if they're not logged in, then back to the login handler
  bounce2: function (req, res, next) {
    req.url = '/api/users/login/cas';
    cas.bounce(req, res, next);
  }
};