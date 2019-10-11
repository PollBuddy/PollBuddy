var createError = require('http-errors');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  next(createError(405));
});

router.get('/classID/', function(req, res, next) {
  res.send('i am getting class ID things');
});

router.get('/classID/polls', function(req, res, next) {
  res.send('i am getting class things based on class ID');
});

module.exports = router;
