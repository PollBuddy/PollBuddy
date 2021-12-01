const bson = require("bson");
const mongoConnection = require("../modules/mongoConnection.js");

/**
 * Helper function for creating the specified http response (https://pollbuddy.app/api/users).
 * For sample usage see https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Overview#helper-functions
 * @param {*} [data] - data payload returned to the callee upon a successful call
 * @param {string} [error] - error message returned to the callee upon a failed call
 * @typedef {Object} HttpResponse
 * @property {string} result - "success" or "failure", depending on if param "error" is present
 * @property {*} [data] - "data" passed in the param
 * @property {string} [error] - "error" passed in the param
 * @returns {HttpResponse}
 */
function createResponse(data, error) {
  const payload = {
    result: !error ? "success" : "failure"
  };
  if (data) {
    payload.data = data;
  }
  if (error) {
    payload.error = error;
  }
  return payload;
}

// Check if ID exists for a specific Collection
// returns objectID if valid or null if nothing is found.
async function validateID(collection, id) {
  try {
    const objId = new mongoConnection.getMongo().ObjectID(id);
    const res = await mongoConnection.getDB().collection(collection) // find id cursor
      .find({_id: objId}, {limit: 1});
    if (await res.hasNext()) {
      return objId;  // exists
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

/**
 * Convenience function to get the currently logged in user
 * Dumps result into passed callback function
 * @returns {void} 
 * @name getCurrentUser
 * @param {req} req request object
 * @param {callback} callback handler for (err,result) returned by database query
 */
function getCurrentUser(req,callback) {
  mongoConnection.getDB().collection("users").findOne({ _id: bson.ObjectId(req.session.userData.userID) }, { projection: { Password: false } }, (err, result) => {
    callback(err,result);
  });
}

// Middleware to check if login is required for the poll.
// poll ID must be present in req.params.id (in the url).
// will attach a valid objectID on req.valid.id.
async function checkPollPublic(req, res, next) {
  // validate poll id
  const id = await validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  req.parsedID = id;
  // check poll publicity
  try {
    const poll = await mongoConnection.getDB().collection("polls").findOne({_id: id}, {projection: {Public: 1}});
    console.log(poll);
    if (!poll.Public) { // poll not public
      // check logged in
      if (!isLoggedIn(req)) {
        return res.status(403).send(createResponse(null, "Sign-In required."));
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while communicating with the database."));
  }
  next();
}

// Checks if a JS object is empty or not. Returns true if so, false otherwise.
function isEmpty(obj) {
  for(var prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj,prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

/**
 * @typedef {Predicate} - function from request object to either null or an error string
 * returns null on success
 * returns string containing error on failure
 */


/**
 * predicate to check If user is logged in in the request
 * @see {Predicate}
 */
var isLoggedIn = (req) => {
  if(req.session.userData && req.session.userData.userID){
    return null;
  } else {
    return "User is not logged in.";
  }
};

/**
 * predicate to check If user is siteAdmin
 * subcondition of isLoggedIn, all siteAdmins are also logged in
 * @see {Predicate}
 */
var isSiteAdmin = 
  and([
    isLoggedIn,

    (req) => {
      var userID = req.session.userData.userID;
      var user = mongoConnection.getDB().collection("users").findOne({_id : userID});
      if(user.SiteAdmin){
        return null;
      } else {
        return "User is not a site admin.";
      }
    }
  ]);

/**
 * predicate to check if the running image is in development mode
 * @see {Predicate}
 */
var isDevelopmentMode = (req) => {
  if(process.env.DEVELOPMENT_MODE === "true"){
    return null;
  } else {
    return "App is not running in development mode.";
  }
};

/**
 * elevates predicate to a middleware that runs it on the request
 * if it returns null : allows execution to go to next middleware
 * if it returns a msg : responds with this message and ends execution
 * @param {Predicate} p - input predicate 
 * @return {Middleware} - Middlewre version of predicate
 */
function promote(p) {
  return (req,res,next) => {
    var response = p(req);
    if(response === null){
      next();
    } else {
      res.status(401).send(createResponse(null,response));
    }
  };
}

/**
 * combines a list of predicates into a single predicate that succeeds on a given request if at least one of the input predicates succeed
 * @param {Array} ps - list of predicates 
 * @return {Predicate} - composite predicate
 */
function or(ps) {
  return (req) => {
    var response = "empty or()";
    for(var i = 0; i < ps.length ; i++){
      // the first predicate that succeeds ends the testing 
      response = ps[i](req);
      if(response === null){
        return null;
      }
    }
    // if all predicates fail, return the last error
    return response;
  };
}

/**
 * combines a list of predicates into a single predicate that succeeds on a given request iff all input predicates succeed
 * @param {Array} ps - list of predicates 
 * @return {Predicate} - composite predicate
 */
function and(ps) {
  return (req) => {
    var response = "empty and()";
    for(var i = 0; i < ps.length ; i++){
      // the first predicate that fails ends the testing 
      response = ps[i](req);
      if(response !== null){
        return response;
      }
    }
    // if all predicates pass, 
    return null;
  };
}

// augments a route's behavior with generic behaviour when outside of development mode
// for routes that should only be active in development mode
function debugRoute(reg,res,body){
  if(process.env.DEVELOPMENT_MODE === "true"){
    if(body){
      body(reg,res);
    }else{
      return res.status(200).send(createResponse(null, "Route is debug only"));
    }
  }else{
    return res.status(500).send(createResponse(null, "Route is not available"));
  }
}

function getResultErrors(result) {
  let errors = {};
  if (result.error) {
    for (let i = 0; i < result.error.details.length; i++) {
      if (result.error.details[i].context.key in result.value) {
        errors[result.error.details[i].context.key] = true;
      }
    }
  }
  return errors;

}

module.exports = {
  createResponse,
  validateID,
  getCurrentUser,
  checkPollPublic,
  isEmpty,
  isLoggedIn,
  isSiteAdmin,
  isDevelopmentMode,
  promote,
  or,
  and,
  debugRoute,
  getResultErrors
};
