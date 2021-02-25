const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var client;
var db;

// This function is used to create the indexes in the database. These help increase performance and ensure certain
// attributes are unique. This will run on every DB connect, but it should silently do nothing if the indexes
// already exist in the database.
function createIndexes() {
  // Create unique indexes
  db.collection("users").createIndex({"Email": 1}, {unique: true});
  db.collection("users").createIndex({"UserName": 1}, {unique: true});

  // Create non-unique indexes
  // Note: May be desirable to add other details like Name,eMail in the future to the SchoolAffiliation index
  db.collection("users").createIndex({"SchoolAffiliation": 1});
  db.collection("poll_answers").createIndex({"PollID": 1});
  db.collection("poll_answers").createIndex({"UserID": 1});
}

module.exports = {
  connect: function(callback) {

    con();

    function con() {
      client = new MongoClient(process.env.DB_URL);
      client.connect((err) => {
        if (err) {
          console.error("Seems the database isn't up yet, retrying in 1 second");
          setTimeout(function () {
            con();
          }, 3000);
        } else {
          db = client.db(process.env.DB_NAME);
          console.log("Database connected");

          createIndexes();
          callback(true);
        }
      });

    }
  },
  disconnect: function(callback) {
    client.close(function() {
      callback(true);
    });
  },
  getDB: function(){
    return db;
  },
  getMongo: function(){
    return mongo;
  },
  validateID: function(id, type){
    //check for valid type
    if(type == "groups" || type == "polls" || type == "users") {
      //find ID object, stopping after the first one found to preserve time
      if(db.collection(type).countDocuments({id}, {limit: 1}) > 0 ) {
        return true;
      }
    }
    return false;
  }
};
