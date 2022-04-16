// Load values from .env file
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const os = require("os");

// Handles /api/groups routes URLs
const groupsRouter = require("./routes/groups");
// Handles /api/polls routes URLs
const pollsRouter = require("./routes/polls");
// Handles /api/users routes URLs
const usersRouter = require("./routes/users");
// In case we run into CORS issues
const cors = require("cors");

const app = express();

// Express Session
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

// Database
const mongoConnection = require("./modules/mongoConnection.js");
mongoConnection.connect(function (res) {
  if (res !== true) {
    console.error(res);
  }
  let clientPromise = mongoConnection.getClient();
  console.log("Connecting express-session");
  app.use(expressSession({
    cookie: {
      maxAge: 2629800000
    },
    name: "pollbuddy_session",
    secret: process.env["SESSION_SECRET"],
    secure: true,
    rolling: true,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ clientPromise })
  }));
});



// Cors: https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
app.use(cors());

// InfluxDB
const influxConnection = require("./modules/influx.js");

// Response Time Logging to InfluxDB
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request to ${req.path} took ${duration}ms`);

    influxConnection.log([
      {
        measurement: "response_times",
        tags: {
          host: os.hostname(),
          platform: "backend",
          path: req.path
        },
        fields: {
          duration: duration
        },
        timestamp: new Date()
      }
    ]);
  });
  return next();
});

// Automated Email System
const email = require("./modules/email.js");
email.initialize();
// TODO: Remove this example after the system gets used somewhere (likely in the forgot password system)
// email.send("user@domain.com", "This is a cool email!", "HTML <b>tags</b> work too!");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/groups", groupsRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/users", usersRouter);

const schoolsModule = require("./modules/schoolList.js");

const {createResponse} = require("./modules/utils");

// eslint-disable-next-line no-unused-vars
app.get("/api/schools", (req, res) => {
  let schools = schoolsModule.getList();
  res.json(schools);
});

/**
 * Root (home) page
 * backend isn't *supposed* to get this request normally.
 * It's defined here as a graceful handling of a bare request.
 * Returns a status 200 OK message to indicate the backend handled the request and is working.
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws 200 - OK
 * @name GET /
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
app.get("/", function (req, res) {
  return res.status(200).send(createResponse("Backend is up."));
});

/**
 * API Root page
 * Does not do anything by itself, defined as a graceful response to the api root
 * Returns a status 200 OK message to indicate the backend handled the request and is working.
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws 200 - OK
 * @name GET /api
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
app.get("/api", function (req, res) {
  return res.status(200).send(createResponse("Backend is up."));
});

/**
 * API health check page
 * Does not do anything by itself, defined as a graceful response to the Docker health check
 * Returns a status 200 OK message to indicate the backend handled the request and is working.
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws 200 - OK
 * @name GET /api/healthcheck
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
app.get("/api/healthcheck", function (req, res) {
  return res.status(200).send(createResponse("Backend is working."));
});

/**
 * Fall-through response for undefined routes
 * Sends a 404 error down to the next middleware (the error handler)
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws 404 - Not Found
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
  res.status(404).send(createResponse(null, "API route not found."));
});


/**
 * Final error handler for errors in the backend.
 * Errors in the backend are sent to this function for handling.
 * The error is logged in the console, as well as the error message.
 * If this is the development environment, the entire error is placed in the response as well under res.locals.err.
 * If the error has an associated status, it is sent in the response.
 * If not, it sends 500 as the status (generic server error)
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws error code of given error, or 500 - server error
 * @param {function} callback - Function handler for endpoint.
 */
app.use(function (err, req, res) {

  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
