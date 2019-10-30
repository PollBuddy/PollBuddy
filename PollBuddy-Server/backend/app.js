var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var classesRouter = require('./routes/classes');
var pollsRouter = require('./routes/polls');
var usersRouter = require('./routes/users');

// In case we run into CORS issues
var cors = require('cors');

var app = express();

// Cors: https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
app.use(cors());

// MongoDB Database Connection Setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://db:27017';
const dbName = 'pollbuddy';
var db;
const client = new MongoClient(url);
client.connect((err) => {
  if (err) return console.log(err);
  db = client.db(dbName);
  console.log("Database connected");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/classes', classesRouter);
app.use('/api/polls', pollsRouter);
app.use('/api/users', usersRouter);


// When visiting /test, the database connection finds all documents in all collections, and returns them in JSON.
app.get('/test', (req, res) => {
  var documents = [];
  db.listCollections().toArray().then((data) => {
    // Here you can do something with your data
    var itemsProcessed = 0;
    data.forEach(function (c) {
      db.collection(c["name"]).find({}).toArray(function (err, document) {
        documents.push(document);
        itemsProcessed++;
        if(itemsProcessed === data.length) {
          callback();
        }
      });
    });
    function callback() {
      res.json(documents);
    }
  });
});


// Root page (aka its working)
app.get('/', function(req, res, next) {
  next(createError(200));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

