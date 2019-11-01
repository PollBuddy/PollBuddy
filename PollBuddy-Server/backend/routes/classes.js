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
router.get('/:id/', function(req, res, next) {
	var id = req.params.id;
	db.collection("classes").find(ObjectID(id)).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting class ID: ' + id);
});

router.get('/:id/polls', function(req, res, next) {
	var id = req.params.id;
	db.collection("classes").find(ObjectID(id),{_id: 0, Polls: 1}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	res.send('i am getting class things based on class ID: '+ id);
});

module.exports = router;
