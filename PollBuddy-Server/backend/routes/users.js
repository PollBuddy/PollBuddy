var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var mongoConnection = require('../modules/mongoConnection.js');
var bcrypt = require('bcrypt');

// GET users listing.
router.get('/', function(req, res, next) {
	mongoConnection.getDB().collection("users").find({}).toArray(function(err, result){
		res.send(result);
	});
});
router.get('/login/', function(req, res, next) {
	res.send('i am a login processor');//TODO
});

router.post('/register', function(req, res, next){
	var requestBody = req.body;

	mongoConnection.getDB().collection('users').insertOne({
		FirstName: requestBody.FirstName,
		LastName: requestBody.LastName,
		Username: requestBody.Username,
		Email: requestBody.Email,
		Password: bcrypt.hashSync(requestBody.Password, 10)
	});
	return res.sendStatus(200);
});
router.post('/:id/edit/', function(req,res){//TODO RCS BOOL refer to documentation
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	var jsonContent = req.body;
	var success = false;
	if(jsonContent.Action === "Add") {
		if(jsonContent.FirstName !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$addToSet":{FirstName: jsonContent.FirstName}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.LastName !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$addToSet":{LastName: jsonContent.LastName}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Username !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$addToSet":{Username: jsonContent.Username}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Email !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$addToSet":{Email: jsonContent.Email}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Password !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$addToSet":{Password: bcrypt.hashSync(jsonContent.Password,10)}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(success === false)return res.sendStatus(400);
	} else if(jsonContent.Action === "Remove") {
		if(jsonContent.FirstName !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$pull":{FirstName: jsonContent.FirstName}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.LastName !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$pull":{LastName: jsonContent.LastName}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Username !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$pull":{Username: jsonContent.Username}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Email !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$pull":{Email: jsonContent.Email}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(jsonContent.Password !== undefined)
			mongoConnection.getDB().collection("users").updateOne({"_id" : id},{"$pull":{Password: jsonContent.Password}}, function(err,res){
				if(err)return res.sendStatus(500);
				else success = true;
			});
		if(success === false)return res.sendStatus(400);
	}else return res.sendStatus(400);
	return res.sendStatus(200); // TODO: Ensure this is true
});
router.get('/:id/', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("users").find({"_id" : id}).toArray(function(err,result){
		if(err)return res.sendStatus(500);
		return res.send(result);
	});
});

router.get('/:id/groups', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("users").find({"_id" : id},{projection:{_id: 0, Groups: 1}}).map(function(item){return res.send(item.Groups);}).toArray(function(err,result){
		if(err)return res.sendStatus(500);
		return res.send(result[0]);
	});
});

module.exports = router;
