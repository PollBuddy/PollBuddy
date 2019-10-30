var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoUtil = require( './mongoConnection.js' );
var db = mongoUtil.getDb();
/* GET users listing. */
router.get('/', function(req, res, next) {
  db.collection("polls").find({}).toArray(function(err, result){
		res.send(result);
	});
});

router.get('/pollID/', function(req, res, next) {
  res.send('i am getting poll ID things');
});

module.exports = router;
