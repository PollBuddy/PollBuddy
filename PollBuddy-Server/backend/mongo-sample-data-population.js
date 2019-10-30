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

  var completes = [];
  var elements = [
    ["test", { SIS: "Man" }],
    ["users", { FirstName: "Bill", LastName: "Cheese", Username: "cheb", email: "cheb@rpi.edu", password: "password1", RCS: "cheb" }],
    ["users", { FirstName: "Suzy", LastName: "Stevenson", Username: "stevs3!", email: "fuzzytesting@rpi.edu", password: "password2!", RCS: "stev3" }],
    ["classes", { Name: "RCOS", instructors: ["Turner (should be ID later)"], AssociatedPolls: [] }],
    ["classes", { Name: "Chemistry", instructors: ["Kirover-Snover (should be ID later)"], AssociatedPolls: [] }],
    ["polls", { Name: "Chem 1 Poll 1", Questions: ["What is your name?", "What grade are you in?"], Answers: ["OpenEnded", [10, 11, 12]] }],
    ["polls", { Name: "RCOS Poll 1", Questions: ["What project are you on?", "True/False: RCOS Sux"], Answers: ["", [10, 11, 12]] }],
  ]; // format: ["collection, { obj: "value"} ],

  db.dropDatabase(function() {

    console.log("Dropping DB");

    elements.forEach(function (element) {
      addObj(element)
    });
  });

  var checkClose = setInterval(function() {
    if(completes.length === elements.length) {
      client.close();
      clearInterval(checkClose);
    }
  }, 1000);

  function addObj(element) {
    console.log("Inserting: " + JSON.stringify(element[1]));
    db.collection(element[0]).insertOne(element[1], function(err, res) {
      if (err) throw err;
      console.log("Inserted: " + JSON.stringify(element[1]));
      completes.push(element[1]);
    });
  }

});

