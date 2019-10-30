// MongoDB Database Connection Setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'pollbuddy';
var db;
const client = new MongoClient(url);
client.connect((err) => {
  if (err) return console.log(err);
  db = client.db(dbName);
  console.log("Database connected");

  //db.collection("test").findOne({}, function(err, document) {
  //  console.log(document);
  //});

  db.dropDatabase(function() {

    var test = { SIS: "Man" };
    db.collection("test").insertOne(test, function(err, res) {
      if (err) throw err;
      console.log("test document inserted");
    });

    var user1 = { FirstName: "Bill", LastName: "Cheese", Username: "cheb", email: "cheb@rpi.edu", password: "password1", RCS: "cheb" };
    db.collection("users").insertOne(user1, function(err, res) {
      if (err) throw err;
      console.log("user1 document inserted");
    });

    var user2 = { FirstName: "Suzy", LastName: "Stevenson", Username: "stevs3!", email: "fuzzytesting@rpi.edu", password: "password2!", RCS: "stev3" };
    db.collection("users").insertOne(user2, function(err, res) {
      if (err) throw err;
      console.log("user2 document inserted");
    });

    var class1 = { Name: "RCOS", instructors: ["Turner (should be ID later)"], AssociatedPolls: [] };
    db.collection("classes").insertOne(class1, function(err, res) {
      if (err) throw err;
      console.log("class1 document inserted");
    });

    var class2 = { Name: "Chemistry", instructors: ["Kirover-Snover (should be ID later)"], AssociatedPolls: [] };
    db.collection("classes").insertOne(class2, function(err, res) {
      if (err) throw err;
      console.log("class2 document inserted");
    });

    var poll1 = { Name: "Chem 1 Poll 1", Questions: ["What is your name?", "What grade are you in?"], Answers: ["OpenEnded", [10, 11, 12]]};
    db.collection("polls").insertOne(poll1, function(err, res) {
      if (err) throw err;
      console.log("poll1 document inserted");
    });

    var poll2 = { Name: "RCOS Poll 1", Questions: ["What project are you on?", "True/False: RCOS Sux"], Answers: ["", [10, 11, 12]]};
    db.collection("polls").insertOne(poll2, function(err, res) {
      if (err) throw err;
      console.log("poll2 document inserted");
    });

    setTimeout(function() {
      client.close();
    }, 2000);

  });
});
