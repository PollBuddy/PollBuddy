var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.post('/new/', function(req,res){
	var jsonContent = req.body;
	mongoConnection.getDB().collection("polls").insertOne({Name: jsonContent.Name});
	return res.sendStatus(200); // TODO: Ensure this is true
});
router.post('/:id/edit/', function(req,res){
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = req.body;
	if(jsonContent.Action === "Add"){
		if(jsonContent.Question !== undefined)
			mongoConnection.getDB().collection("polls").updateOne({"_id" : id},{"$set":{Question: jsonContent.Question}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else
			return res.sendStatus(400);
	}else if(jsonContent.Action === "Remove"){
		if(jsonContent.Question !== undefined)
			mongoConnection.getDB().collection("polls").updateOne({"_id" : id},{"$unset":{Question: ""}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else 
			return res.sendStatus(400);
	}else return res.sendStatus(400);
	return res.sendStatus(200); // TODO: Ensure this is true
});
router.post('/:id/delete/', function(req,res){//use router.delete??
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("polls").deleteOne({"_id" : id}, function(err,res){
		if(err)return res.sendStatus(500);
	});
	return res.sendStatus(200);
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
	//res.sendStatus('i am getting poll ID: ' + id);
});

module.exports = router;
