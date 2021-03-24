Back-end Techonology:


## bcrypt
This is a package to help hash passwords

NPM Link: https://www.npmjs.com/package/bcrypt


## bson
This is a binary JSON parser

NPM Link: https://www.npmjs.com/package/bson


## cas-authentication
This is a package for redirecting to cas login (the system RPI uses for logins)

NPM Link: https://www.npmjs.com/package/cas-authentication


## connect-mongo
connect-mongo is a package for linking Express session to a mongoDB session

NPM Link: https://www.npmjs.com/package/connect-mongo


## cookie-parser
This is a package for parsing cookies

NPM link: https://www.npmjs.com/package/cookie-parser


## cors
This is a package for enabling CORS 

    (Cross-Origin Resource Sharing: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

NPM Link: https://www.npmjs.com/package/cors


## debug
This is a package for exposing functions to pass debug statements to

NPM Link: https://www.npmjs.com/package/debug


## dotenv
dotenv loads environment variables from a .env file into process.env (a Node.js method for setting the user environment)

NPM Link: https://www.npmjs.com/package/dotenv


## eslint
eslint is a tool to help keep code formatting consistent, see .eslintrc.json for the current defined formatting rules 

NPM Link: https://www.npmjs.com/package/eslint


## Express
Express is a framework that runs within Node.js that allows for server creation and maintenance

app.js is where the main Express code runs, and the files in the routes folder are linked to app.js with lines like:

    app.use("/api/users", usersRouter);

This uses the router application built into Express, allowing us to break up the Express calls into seperate files 

Express works with what it calls "middleware", which are the functions that happen when a call to the server is made

    e.g.:   
            app.get("/api/test", (req, res) => {
                ...CODE...
            }
    runs CODE whenever the call for /api/test is made
    and:    
            var usersRouter = require("./routes/users");
            app.use("/api/users", usersRouter);

    directs any calls to /api/users to the file ./routes/users, 
    which is where we store our Express functions for users information

See     https://expressjs.com/en/4x/api.html    for the full documentation


## express-session
This is a package for creating an express session

NPM Link: https://www.npmjs.com/package/express-session


## http-errors
This is a package for creating error messages

    Usage: 
            var createError = require('http-errors')
            if (condition) return next(createError(###, "Error message"))

NPM Link: https://www.npmjs.com/package/http-errors


## Influx
Influx is a package to run InfluxDB in Node.js

We mainly use it to log the time it takes to for mongoDB to run and analyse any performance issues

NPM Link: https://www.npmjs.com/package/influx

Also see: https://docs.influxdata.com/influxdb/cloud/ for InfluxDB full documentation


## morgan
morgan is a logger package (controls the recording of what happens in when a program runs)

NPM link: https://www.npmjs.com/package/morgan


### MongoDB
MongoDB is the database that PollBuddy uses to store our information

At the top of the information hierarchy there are collections, e.g. "users"

Every collection contains .JSON files with unique IDs to their collection 
    (these are usually strings of characters and numbers)

Every ID can then have data types linked to them

These can be called a lot of things, and every ID in a collection will have the same data types in their .JSON files. So refer to the routes page to see the types of data each collection holds

    e.g. a user could have the data type "classes" that contains the name of their classes

    so to get the list of classes that user "123" has in an array: 
            mongoConnection.getDB().collection("users").find({ "_id": "123" }, {"_id": 0, "classes": 1})
            .getDB() calls the database
            .collection("users") calls the collection containing all .JSON files for users
            .find({ "_id": "123" }, finds the .JSON file with id "123"
            {"_id": 0, "classes": 1})  and returns the classes data type, while excluding the id type 
            (mongodb automatically returns the id unless it is excluded)

    Please note "classes" is not actually a supported data type in "users", it is just an example for this readme

NPM link: https://www.npmjs.com/package/mongodb


## Node.js
Node.js is an open source JavaScript runtime environment that allows code to executed outside of a browser

Node.js is the name of the environment, it is not the name of the file despite ending in .js like JavaScript files do

It runs a single-threaded event loop while optimizing code to limit blocking 
    (blocking = waiting on one line to execute before calling the next)

People have written a plethora of packages that run on Node.js that can help with your code

    find packages at: https://www.npmjs.com/

So essentially Node.js is what allows us to run our code on the backend

See: https://nodejs.org/api/ for the full documentation


## promise-retry
This package enables retrying a function until it runs out of retries or gets a valid result

NPM Link: https://www.npmjs.com/package/promise-retry

