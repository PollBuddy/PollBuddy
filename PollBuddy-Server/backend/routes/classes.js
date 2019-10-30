var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoUtil = require( './mongoConnection.js' );
var db = mongoUtil.getDb();

router.get('/', function(req, res, next) {
	db.collection("classes").find({}).toArray(function(err, result){
		res.send(result);
	});
});

router.get('/classID/', function(req, res, next) {//classID to be replaced somehow
	
	res.send('i am getting class ID things');
});

router.get('/classID/polls', function(req, res, next) {
	res.send('i am getting class things based on class ID');
});

module.exports = router;
