const Influx = require('influx');
let influx = new Influx.InfluxDB({
    host: "influxdb", // You must run in Docker-Compose for this to work
    database: "pollbuddy",
    username: "pollbuddy",
    password: "pollbuddy"
});

function getDatestamp() {
    let d = new Date();
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " +
        d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

module.exports = {

    log: function(data) {
        influx.writePoints(data).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
        });
    }

};