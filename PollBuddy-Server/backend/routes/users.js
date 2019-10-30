var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoUtil = require( './mongoConnection.js' );
var db = mongoUtil.getDb();
/* GET users listing. */
router.get('/', function(req, res, next) {
	db.collection("users").find({}).toArray(function(err, result){
		res.send(result);
	});
};

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
