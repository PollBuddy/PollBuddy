const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var client;
var db;

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