const Influx = require('influx');
let influx = new Influx.InfluxDB({
    host: "influxdb", // You must run in Docker-Compose for this to work
    database: "pollbuddy",
    username: "pollbuddy",
    password: "pollbuddy"
});

module.exports = {

    log: function(data) {
        influx.writePoints(data).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
        });
    }

};