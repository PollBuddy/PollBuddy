var createError = require('http-errors');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  next(createError(405));
});

router.get('/login/', function(req, res, next) {
  res.send('i am a login processor');
});

router.get('/userID/', function(req, res, next) {
  res.send('i am a user ID processor');
});

router.get('/login/', function(req, res, next) {
  res.send('i am a user ID classes processor');
});

module.exports = router;
