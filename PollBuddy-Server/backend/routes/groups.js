var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.post('/new/', function(req,res){
	var jsonContent = req.body;
	if(jsonContent.Name == null||jsonContent.Name == "")return res.sendStatus(400);
	mongoConnection.getDB().collection("groups").insertOne({Name: jsonContent.Name}, function(err,res){
		if(err)return res.sendStatus(500);
	});
	return res.sendStatus(200); // TODO: Ensure this is true
});
router.post('/:id/edit/', function(req,res){
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = req.body;
	if(jsonContent.Action === "Add"){
		if(jsonContent.Name !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$set":{Name: jsonContent.Name}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.InstructorID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$set":{InstructorID: jsonContent.InstructorID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$set":{PollID: jsonContent.PollID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$set":{UserID: jsonContent.UserID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else
			return res.sendStatus(400);
	}else if(jsonContent.Action === "Remove"){
		if(jsonContent.InstructorID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$unset":{InstructorID: ""}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$unset":{PollID: ""}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$unset":{UserID: ""}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else
			return res.sendStatus(400);
	}else
	return res.sendStatus(400);
  return res.sendStatus(200); // TODO: Ensure this is true
});
router.post('/:id/delete/', function(req,res){//use router.delete??
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").deleteOne({"_id" : id}, function(err,res){
		if(err)return res.sendStatus(500);
	});
	res.sendStatus(200);
});
router.get('/', function(req, res, next) {
	mongoConnection.getDB().collection("groups").find({}).toArray(function(err, result){
		res.send(result);
	});
});
router.get('/:id/', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id}).toArray(function(err,result){
		if(err)throw err;
		return res.send(result);
	});
	//res.sendStatus('i am getting group ID: ' + id);
});
router.get('/:id/polls', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, Polls: 1}}).toArray(function(err,result){
		if(err)throw err;
		return res.send(result);
	});
	//res.sendStatus('i am getting group things based on group ID: '+ id);
});
router.get('/:id/users', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, Users: 1}}).toArray(function(err,result){
		if(err)throw err;
		return res.send(result);
	});
	//res.sendStatus('i am getting group things based on group ID: '+ id);
});

module.exports = router;
