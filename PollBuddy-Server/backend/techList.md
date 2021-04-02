# Back-end Technologies

## bcrypt

This is a package to help hash passwords.

NPM Link: <https://www.npmjs.com/package/bcrypt>

## bson

This is a binary JSON parser.

NPM Link: <https://www.npmjs.com/package/bson>

## express-cas-authentication

This is a package for redirecting to cas login (the system RPI uses for logins).

NPM Link: <https://www.npmjs.com/package/express-cas-authentication>

## connect-mongo

connect-mongo is a package for linking Express session to a mongoDB session.

NPM Link: <https://www.npmjs.com/package/connect-mongo>

## cookie-parser

This is a package for parsing cookies.

NPM link: <https://www.npmjs.com/package/cookie-parser>

## cors

This is a package for enabling CORS ([Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)).

NPM Link: <https://www.npmjs.com/package/cors>

## debug

This is a package for exposing functions to pass debug statements to.

NPM Link: <https://www.npmjs.com/package/debug>

## dotenv

dotenv loads environment variables from a .env file into process.env (a Node.js method for setting the user environment).

NPM Link: <https://www.npmjs.com/package/dotenv>

## eslint

eslint is a tool to help keep code formatting consistent. See .eslintrc.json for the current defined formatting rules.

NPM Link: <https://www.npmjs.com/package/eslint>

## Express

Express is a framework that runs within Node.js that allows for server creation and maintenance.

`app.js` is where the main Express code runs, and the files in the routes folder are linked to app.js with lines like:

```
app.use("/api/users", usersRouter);
```

This uses the router application built into Express, allowing us to break up the Express calls into separate files.

Express works with what it calls "middleware", which are the functions that happen when a call to the server is made.

Example:

``` JavaScript
app.get("/api/test", (req, res) => {
    ...CODE...
}
```

This runs `CODE` whenever the call for /api/test is made, and

``` JavaScript
var usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);
```

directs any calls to `/api/users` to the file `./routes/users`, which is where we store our Express functions for users information.

NPM Link: <https://www.npmjs.com/package/express>

Also see <https://expressjs.com/en/4x/api.html> for full documentation

## express-session

This is a package for creating an express session.

NPM Link: <https://www.npmjs.com/package/express-session>

## http-errors

This is a package for creating error messages.

Usage:

``` JavaScript
var createError = require('http-errors')
if (condition) return next(createError(###, "Error message"))
```

NPM Link: <https://www.npmjs.com/package/http-errors>

## Influx

Influx is a package to access InfluxDB databases in Node.js.

We mainly use it to log API response amounts and times, the time it takes to for mongoDB queries to run, and frontend page accesses. We then use this anonymous data to help us analyze the app for any performance issues and areas that need improvement.

NPM Link: <https://www.npmjs.com/package/influx>

Also see <https://docs.influxdata.com/influxdb/cloud/> for full documentation.

## joi

joi is a package that acts as a schema descriptor as well as a data validator for JavaScript

joi is used mainly to validate that user input data such as logins, passwords, emails, names, etc.
are valid

NPM Link: <https://www.npmjs.com/package/joi>

## morgan

morgan is a logger package (controls the recording of what happens in when a program runs).

NPM link: <https://www.npmjs.com/package/morgan>

### MongoDB

MongoDB is the database that Poll Buddy uses to store information.

At the top of the information hierarchy there are collections, e.g. "users". Every collection contains .JSON files with IDs unique to their collections (these are usually strings of characters and numbers). Each object can then have other data types used in them.

Please refer to the [Database Schema Wiki Page](https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Database-Schema) to see how we use MongoDB to store data for our app.

NPM link: <https://www.npmjs.com/package/mongodb>

## Node.js

Node.js is an open source JavaScript runtime environment that allows JavaScript code to executed outside the browser. It runs a single-threaded event loop while optimizing code to limit blocking (waiting on one block of code to execute before calling the next). People have written a plethora of packages that run on Node.js that can help with your code (found at <https://www.npmjs.com>). The frontend and backend of Poll Buddy use Node.js.

See: <https://nodejs.org/api/> for the full documentation

## promise-retry

This package enables retrying a function until it runs out of retries or gets a valid result.

NPM Link: <https://www.npmjs.com/package/promise-retry>
