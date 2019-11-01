const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://db:27017';
const database = 'pollbuddy';

var db;

module.exports = {
	connect: function(callback){
		MongoClient.connect(url, function(err, client){
			db = client.db(database);
			return callback(err);
		});
	},
	getDB: function(){
		return db;
	}
};