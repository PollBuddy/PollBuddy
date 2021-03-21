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
  // Note: May be desirable to add other details like Name,eMail in the future to the SchoolAffiliation index
  db.collection("users").createIndex({"SchoolAffiliation": 1}, {name: "users_SchoolAffiliation", unique: true}).catch(function() {
    db.collection("users").dropIndex("users_SchoolAffiliation_1").then(function() {
      db.collection("users").createIndex({"SchoolAffiliation": 1}, {name: "users_SchoolAffiliation_1", unique: true});
    });
  });
  db.collection("poll_answers").createIndex({"PollID": 1}, {name: "poll_answers_PollID_1", unique: true}).catch(function() {
    db.collection("poll_answers").dropIndex("poll_answers_PollID_1").then(function() {
      db.collection("poll_answers").createIndex({"PollID": 1}, {name: "poll_answers_PollID_1", unique: true});
    });
  });
  db.collection("poll_answers").createIndex({"UserID": 1}, {name: "poll_answers_UserID_1", unique: true}).catch(function() {
    db.collection("poll_answers").dropIndex("poll_answers_UserID_1").then(function() {
      db.collection("poll_answers").createIndex({"UserID": 1}, {name: "poll_answers_UserID_1", unique: true});
    });
  });
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
  }
};
