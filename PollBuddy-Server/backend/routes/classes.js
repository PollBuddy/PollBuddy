var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.get('/', function(req, res, next) {
	mongoConnection.getDB().collection("classes").find({}).toArray(function(err, result){
		res.send(result);
	});
});
router.get('/:id/', function(req, res, next) {
	var id = req.params.id;
	mongoConnection.getDB().collection("classes").find(ObjectID(id)).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting class ID: ' + id);
});

router.get('/:id/polls', function(req, res, next) {
	var id = req.params.id;
	mongoConnection.getDB().collection("classes").find(ObjectID(id),{_id: 0, Polls: 1}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting class things based on class ID: '+ id);
});
router.get('/:id/users', function(req, res, next) {
	var id = req.params.id;
	mongoConnection.getDB().collection("classes").find(ObjectID(id),{_id: 0, Users: 1}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting class things based on class ID: '+ id);
});

module.exports = router;
