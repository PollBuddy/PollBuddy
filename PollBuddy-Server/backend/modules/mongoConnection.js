const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var client;
var db;

// This function is used to create the indexes in the database. These help increase performance and ensure certain
// attributes are unique. This will run on every DB connect, but it should silently do nothing if the indexes
// already exist in the database.
async function createIndexes() {

  // Delete old indexes (if applicable)
  await db.collection("users").dropIndex("UserName_1").catch(function() {});
  await db.collection("users").dropIndex("Email_1").catch(function() {});
  await db.collection("users").dropIndex("SchoolAffiliation_1").catch(function() {});
  await db.collection("poll_answers").dropIndex("UserID_1").catch(function() {});
  await db.collection("poll_answers").dropIndex("PollID_1").catch(function() {});


  // The weird chains are to delete old versions (if applicable) and recreate them with the new options

  // Create unique indexes
  db.collection("users").createIndex({"UserName": 1}, {name: "users_UserName_CaseSensitive", unique: true}).catch(function() {
    db.collection("users").dropIndex("users_UserName_CaseSensitive").then(function() {
      db.collection("users").createIndex({"UserName": 1}, {name: "users_UserName_CaseSensitive", unique: true});
    });
  });
  db.collection("users").createIndex({"UserName": 1}, {name: "users_UserName_CaseInsensitive", unique: true, collation: { locale: "en_US", strength: 2 }}).catch(function() {
    db.collection("users").dropIndex("users_UserName_CaseInsensitive").then(function() {
      db.collection("users").createIndex({"UserName": 1}, {name: "users_UserName_CaseInsensitive", unique: true, collation: { locale: "en_US", strength: 2 }});
    });
  });
  db.collection("users").createIndex({"Email": 1}, {name: "users_Email_CaseSensitive", unique: true}).catch(function() {
    db.collection("users").dropIndex("users_Email_CaseSensitive").then(function() {
      db.collection("users").createIndex({"Email": 1}, {name: "users_Email_CaseSensitive", unique: true});
    });
  });
  db.collection("users").createIndex({"Email": 1}, {name: "users_Email_CaseInsensitive", unique: true, collation: { locale: "en_US", strength: 2 }}).catch(function() {
    db.collection("users").dropIndex("users_Email_CaseInsensitive").then(function() {
      db.collection("users").createIndex({"Email": 1}, {name: "users_Email_CaseInsensitive", unique: true, collation: { locale: "en_US", strength: 2 }});
    });
  });

  // Create non-unique indexes
  // Note: May be desirable to add other details like Name and email in the future to the SchoolAffiliation index
  db.collection("users").createIndex({"SchoolAffiliation": 1}, {name: "users_SchoolAffiliation"}).catch(function() {
    db.collection("users").dropIndex("users_SchoolAffiliation").then(function() {
      db.collection("users").createIndex({"SchoolAffiliation": 1}, {name: "users_SchoolAffiliation"});
    });
  });
  db.collection("poll_answers").createIndex({"PollID": 1}, {name: "poll_answers_PollID"}).catch(function() {
    db.collection("poll_answers").dropIndex("poll_answers_PollID").then(function() {
      db.collection("poll_answers").createIndex({"PollID": 1}, {name: "poll_answers_PollID"});
    });
  });
  db.collection("poll_answers").createIndex({"UserID": 1}, {name: "poll_answers_UserID"}).catch(function() {
    db.collection("poll_answers").dropIndex("poll_answers_UserID").then(function() {
      db.collection("poll_answers").createIndex({"UserID": 1}, {name: "poll_answers_UserID"});
    });
  });
}

module.exports = {
  //Todo: Use Async/Await
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

          createIndexes().then(function() {
            callback(true);
          });
        }
      });
    }
  },
  disconnect: function(callback) {
    client.close(function() {
      callback(true);
    });
  },
  setClient: function(_client) {
    client = _client;
  },
  getClient: function() {
    return client;
  },
  setDB: function(_db){
    db = _db;
  },
  getDB: function(){
    return db;
  },
  getMongo: function(){
    return mongo;
  },
  validateID: function(ID, type){
    //check for valid type
    if(type == "groups" || type == "polls" || type == "users") {
      //find ID object, stopping after the first one found to preserve time
      if(db.collection(type).countDocuments({"_id": ID}, {limit: 1}) > 0 ) {
        return true;
      }
    }
    return false;
  }
};
