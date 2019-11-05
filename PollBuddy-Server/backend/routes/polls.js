var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

// GET users listing.
router.get('/', function(req, res, next) {
	mongoConnection.getDB().collection("polls").find({}).toArray(function(err, result){
		res.send(result);
	});
});
router.get('/:id/', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("polls").find({"_id" : id}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	//res.send('i am getting poll ID: ' + id);
});

module.exports = router;
