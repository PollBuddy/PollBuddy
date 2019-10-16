var createError = require('http-errors');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  next(createError(405));
});

router.get('/pollID/', function(req, res, next) {
  res.send('i am getting poll ID things');
});

module.exports = router;
