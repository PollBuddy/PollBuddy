var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.post('/new/', function(req,res){
	var jsonContent = JSON.parse(req);
	mongoConnection.getDB().collection("polls").insertOne({Name: jsonContent.Name});
});
router.post('/:id/edit/', function(req,res){
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = JSON.parse(req);
	if(jsonContent.Action == "Add"){
		if(jsonContent.Question != undefined)
			mongoConnection.getDB().collection("polls").updateOne({"_id" : id},{$set:{Question: jsonContent.Question}});
	}else if(jsonContent.Action == "Remove"){
		if(jsonContent.Question != undefined)
			mongoConnection.getDB().collection("polls").updateOne({"_id" : id},{$unset:{Question: ""}});
	}
});
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
