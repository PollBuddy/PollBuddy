const CASAuthentication = require("cas-authentication");

// Register RPI as a school that can be logged in with
const schoolList = require("./schoolList");
schoolList.append("Rensselaer Polytechnic Institute (RPI)", "/api/users/login/rpi");

const cas = new CASAuthentication({
  /* eslint-disable camelcase */
  cas_url: process.env.CAS_URL || "https://cas-auth.rpi.edu/cas",
  service_url: process.env.CAS_SERVICE_URL || "http://localhost:7655",
  cas_version: "3.0",
  /* eslint-enable camelcase */
  renew: false
});

module.exports = {
  bounce: cas.bounce,
  // eslint-disable-next-line camelcase
  bounce_redirect: cas.bounce_redirect,
  block: cas.block,
  logout: cas.logout,
  // Bounce user to RPI's login page if they're not logged in, then back to the login handler
  bounce2: function (req, res, next) {
    req.url = "/api/users/login/rpi";
    cas.bounce(req, res, next);
  }
};
