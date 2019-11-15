var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.post('/new/', function(req,res){
	var jsonContent = req.body;
	if(jsonContent.Name == null||jsonContent.Name === "") {
		return res.sendStatus(400);
	}
	mongoConnection.getDB().collection("groups").insertOne({Name: jsonContent.Name}, function(err,res){
		if(err)return res.sendStatus(500);
	});
	return res.sendStatus(200);
});
router.post('/:id/edit/', function(req,res){
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = req.body;
	if(jsonContent.Action === "Add"){
		if(jsonContent.Name !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$set":{Name: jsonContent.Name}}, function(err,res){
				if(err) return res.sendStatus(500);
			});
		else if(jsonContent.InstructorID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$addToSet":{InstructorID: jsonContent.InstructorID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$addToSet":{PollID: jsonContent.PollID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$addToSet":{UserID: jsonContent.UserID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else
			return res.sendStatus(400);
	}else if(jsonContent.Action === "Remove"){
		if(jsonContent.InstructorID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$pull":{InstructorID: jsonContent.InstructorID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$pull":{PollID: jsonContent.PollID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{"$pull":{UserID: jsonContent.UserID}}, function(err,res){
				if(err)return res.sendStatus(500);
			});
		else
			return res.sendStatus(400);
	} else {
		return res.sendStatus(400);
	}
	return res.sendStatus(200);
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
		if(err)return res.sendStatus(500);
		return res.send(result);
	});
	//res.sendStatus('i am getting group ID: ' + id);
});
router.get('/:id/polls', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, PollID: 1}}).toArray(function(err,result){
		if(err)return res.sendStatus(500);
		return res.send(result);
	});
	//res.sendStatus('i am getting group things based on group ID: '+ id);
});
router.get('/:id/users', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, UserID: 1}}).toArray(function(err,result){
		if(err)return res.sendStatus(500);
		return res.send(result);
	});
	//res.sendStatus('i am getting group things based on group ID: '+ id);
});

module.exports = router;
