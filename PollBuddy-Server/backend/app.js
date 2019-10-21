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
// Create a new MongoClient
const client = new MongoClient(url);
// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to the MongoDB database server");
  const db = client.db(dbName);
  client.close();
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
