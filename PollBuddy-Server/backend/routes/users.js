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
	res.send('i am a login processor');
});

router.post('/register', function(req, res, next){
	var requestBody = req.body;

	mongoConnection.getDB().collection('users').insertOne({
		FirstName: requestBody.firstName,
		LastName: requestBody.lastName,
		Username: requestBody.username,
		Email: requestBody.email,
		Password: bcrypt.hashSync(requestBody.password, 10)
	});
	return res.sendStatus(200);
});

router.get('/:id/', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("users").find({"_id" : id}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
});

router.get('/:id/classes', function(req, res, next) {
	var id = new mongoConnection.getMongo().ObjectID(req.params.id);
	mongoConnection.getDB().collection("users").find({"_id" : id},{projection: {_id: 0, Classes: 1}}).toArray(function(err,result){
		if(err)throw err;
		res.send(result);
	});
});

module.exports = router;
