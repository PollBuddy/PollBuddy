const Influx = require("influx");
let influx;

if(process.env.REPORTING_DB_URL) {
  influx = new Influx.InfluxDB({
    // You must run in Kubernetes for this to work by default
    host: process.env.REPORTING_DB_URL,
    database: process.env.REPORTING_DB_NAME,
    username: process.env.REPORTING_DB_USERNAME,
    password: process.env.REPORTING_DB_PASSWORD
  });
} else {
  influx = new Influx.InfluxDB({
    // You must run in Docker-Compose for this to work by default
    host: "reporting-db",
    database: "pollbuddy",
    username: "pollbuddy",
    password: "pollbuddy"
  });
}

module.exports = {

  log: function (data) {
    influx.writePoints(data).catch(err => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    });
  }

};