const CASAuthentication = require("express-cas-authentication");

// Register RPI as a school that can be logged in with
const schoolList = require("./schoolList");
schoolList.append("Rensselaer Polytechnic Institute (RPI)", "rpi");

const cas = new CASAuthentication({
  /* eslint-disable camelcase */
  cas_url: "https://cas-auth.rpi.edu/cas",
  service_url: process.env["FRONTEND_URL"],
  cas_version: "3.0",
  /* eslint-enable camelcase */
  renew: false
});

module.exports = {
  bounce: cas.bounce,
  // eslint-disable-next-line camelcase
  bounce_redirect: cas.bounce_redirect,
  block: cas.block,
  logout: cas.logout
};
