// Load values from .env file
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const os = require("os");

// Handles /api/groups routes URLs
var groupsRouter = require("./routes/groups");
// Handles /api/polls routes URLs
var pollsRouter = require("./routes/polls");
// Handles /api/users routes URLs
var usersRouter = require("./routes/users");
// In case we run into CORS issues
var cors = require("cors");

var app = express();

// Express Session
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
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
  store: MongoStore.create({
    mongoUrl: process.env["DB_URL"],
    dbName: process.env["DB_NAME"]
  })
}));

// Cors: https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
app.use(cors());

var mongoConnection = require("./modules/mongoConnection.js");
mongoConnection.connect(function (res) {
  if (res !== true) {
    console.error(res);
  }
});

// InfluxDB
var influxConnection = require("./modules/influx.js");

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

var schoolsModule = require("./modules/schoolList.js");
app.get("/api/schools", (req, res) => {
  var schools = schoolsModule.getList();
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
app.get("/", function (req, res, next) {
  next(createError(200));
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
app.get("/api", function (req, res, next) {
  next(createError(200));
});

/**
 * Fall-through response for undefined routes
 * Sends a 404 error down to the next middleware (the error handler)
 * For full documentation, see the wiki: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Overview)
 * @throws 404 - Not Found
 * @param {function} callback - Function handler for endpoint.
 */
app.use(function (req, res, next) {
  next(createError(404));
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
app.use(function (err, req, res, next) {

  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
