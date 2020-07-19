const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var db;

module.exports = {
  connect: function(callback){

    con();

    function con() {
      const client = new MongoClient(process.env.DB_URL);
      client.connect((err) => {
        if (err) {
          console.error("Seems the database isn't up yet, retrying in 1 second");
          setTimeout(function () {
            con();
          }, 3000);
        } else {
          db = client.db(process.env.DB_NAME);
          console.log("Database connected");
        }
      });

    }
  },
  getDB: function(){
    return db;
  },
  getMongo: function(){
    return mongo;
  }
};