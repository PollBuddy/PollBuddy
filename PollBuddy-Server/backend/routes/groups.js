var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');

router.post('/new/', function(req,res){
	var jsonContent = req.body;
	console.log(jsonContent);
	mongoConnection.getDB().collection("groups").insertOne({Name: jsonContent.Name});
	res.send(200); // TODO: Ensure this is true
});
router.post('/:id/edit/', function(req,res){
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = req.body;
	if(jsonContent.Action === "Add"){
		if(jsonContent.Instructor !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$set:{Instructor: jsonContent.Instructor}});
		if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$set:{PollID: jsonContent.PollID}});
		if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$set:{UserID: jsonContent.UserID}});
	}else if(jsonContent.Action === "Remove"){
		if(jsonContent.Instructor !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$unset:{Instructor: ""}});
		if(jsonContent.PollID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$unset:{PollID: ""}});
		if(jsonContent.UserID !== undefined)
			mongoConnection.getDB().collection("groups").updateOne({"_id" : id},{$unset:{UserID: ""}});
	}
  res.send(200); // TODO: Ensure this is true
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
		res.send(result);
	});
	//res.send('i am getting group ID: ' + id);
});
router.get('/:id/polls', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, Polls: 1}}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	//res.send('i am getting group things based on group ID: '+ id);
});
router.get('/:id/users', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("groups").find({"_id" : id},{projection:{_id: 0, Users: 1}}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
	//res.send('i am getting group things based on group ID: '+ id);
});

module.exports = router;
