// Load values from .env file
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var groupsRouter = require("./routes/groups");
var pollsRouter = require("./routes/polls");
var usersRouter = require("./routes/users");

// In case we run into CORS issues
var cors = require("cors");

var app = express();

// Express Session
const express_session = require("express-session");
const MongoStore = require("connect-mongo")(express_session);
app.use(express_session({
  cookie: {
    maxAge: 3600000
  },
  name: "pb_session",
  secret: "s3cr3t",// TODO: Move this out of the code and make it secure
  store: new MongoStore({
    url: process.env["DB_URL"],
    dbName: process.env["DB_NAME"]
  })
}));

// Cors: https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
app.use(cors());

var mongoConnection = require("./modules/mongoConnection.js");
mongoConnection.connect(function (err, client) {
  if (err) {
    console.error(err);
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(usersRouter.user_middleware);

app.use("/api/groups", groupsRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/users", usersRouter);

// When visiting /test, the database connection finds all documents in all collections, and returns them in JSON.
app.get("/test", (req, res) => {
  var documents = [];
  mongoConnection.getDB().listCollections().toArray().then((data) => {
    // Here you can do something with your data
    var itemsProcessed = 0;
    data.forEach(function (c) {
      mongoConnection.getDB().collection(c["name"]).find({}).toArray(function (err, document) {
        documents.push(document);
        itemsProcessed++;
        if (itemsProcessed === data.length) {
          callback();
        }
      });
    });

    function callback() {
      res.json(documents);
    }
  });
});

app.get("/gendata", (req, res) => {
  var log = "";
  var completes = [];
  var elements = [
    ["test", {SIS: "Man"}],
    ["users", {
      FirstName: "Bill",
      LastName: "Cheese",
      Username: "cheb",
      email: "cheb@rpi.edu",
      password: "password1",
      RCS: "cheb"
    }],
    ["users", {
      FirstName: "Suzy",
      LastName: "Stevenson",
      Username: "stevs3!",
      email: "fuzzytesting@rpi.edu",
      password: "password2!",
      RCS: "stev3"
    }],
    ["groups", {Name: "RCOS", instructors: ["Turner (should be ID later)"], AssociatedPolls: []}],
    ["groups", {Name: "Chemistry", instructors: ["Kirover-Snover (should be ID later)"], AssociatedPolls: []}],
    ["polls", {
      Name: "Chem 1 Poll 1",
      Questions: ["What is your name?", "What grade are you in?"],
      Answers: ["OpenEnded", [10, 11, 12]]
    }],
    ["polls", {
      Name: "RCOS Poll 1",
      Questions: ["What project are you on?", "True/False: RCOS Sux"],
      Answers: ["", [10, 11, 12]]
    }],
  ]; // format: ["collection, { obj: "value"} ],

  mongoConnection.getDB().dropDatabase(function () {

    log += "Dropping DB\n";

    elements.forEach(function (element) {
      addObj(element)
    });
  });

  var checkClose = setInterval(function () {
    if (completes.length === elements.length) {
      clearInterval(checkClose);
      res.send(log);
    }
  }, 1000);

  function addObj(element) {
    log += "Inserting: " + JSON.stringify(element[1]) + "\n";
    mongoConnection.getDB().collection(element[0]).insertOne(element[1], function (err, res) {
      if (err) {
        throw err;
      }
      log += "Inserted: " + JSON.stringify(element[1]) + "\n";
      completes.push(element[1]);
    });
  }

});


// Root page (aka its working)
app.get("/", function (req, res, next) {
  next(createError(200));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;

