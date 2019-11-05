var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

// GET users listing.
router.get('/', function(req, res, next) {
	mongoConnection.getDB().collection("users").find({}).toArray(function(err, result){
		res.send(result);
	});
});
router.get('/login/', function(req, res, next) {
	res.send('i am a login processor');
});

router.get('/:id/', function(req, res, next) {
	var id = req.params.id;
	mongoConnection.getDB().collection("users").find(ObjectID(id)).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting user ID: ' + id);
});

router.get('/:id/classes', function(req, res, next) {
	var id = req.params.id;
	mongoConnection.getDB().collection("users").find(ObjectID(id),{_id: 0, Classes: 1}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting user ' + id + ' classes');
});

module.exports = router;
