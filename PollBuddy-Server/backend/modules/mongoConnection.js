const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://db:27017';
const database = 'pollbuddy';

var db;

module.exports = {
	connect: function(callback){
		const client = new MongoClient(url);
		client.connect((err) => {
			if(err) return console.error(err);
			db = client.db(database);
			console.log('Database connected from module');
		});
	},
	getDB: function(){
		return db;
	}
};