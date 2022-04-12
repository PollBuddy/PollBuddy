const bson = require("bson");
const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes } = require("../modules/httpCodes.js");
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
  for(let prop in obj) {
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
function isLoggedIn(req,res,next) {
  if(req.session.userData && req.session.userData.userID){
    next();
  } else {
    return res.status(500).send(createResponse(null, "User is not logged in"));
  }
}

/**
 * Predicate to check if user is siteAdmin
 * Also checks to make sure that the user is logged in
 * @see {Predicate}
 */
let isSiteAdmin = 
  and([
    isLoggedIn,
    (req,res,next) => {
      let userID = req.session.userData.userID;
      let user = mongoConnection.getDB().collection("users").findOne({_id: userID});
      if (user.SiteAdmin) {
        next()
      } else {
        return res.status(500).send(createResponse(null, "User is not a site admin."));
      }
    }
  ]);

/**
 * predicate to check if the running image is in development mode
 * @see {Predicate}
 */
function isDevelopmentMode(req,res,next) {
  if(process.env.DEVELOPMENT_MODE === "true"){
    next()
  } else {
    return res.status(500).send(createResponse(null, "App is not running in development mode."));
  }
}


/**
 * combines a list of predicates into a single predicate that succeeds on a given request if at least one of the input predicates succeed
 * @param {Array} ps - list of predicates
 * @return {Predicate} - composite predicate
 */
function or() {
  // passing middleware will call this, alerting us of their result
  let succeed = () => true;
  return (req,res,next) => {
    for(let i = 0; i < arguments.length ; i ++){
      if(arguments[i](req,res,succeed) === true){
        return next();
      }
    }
    return res.status(500).send(createResponse(null, "No conditions passed"));  
  };
}

/**
 * combines a list of predicates into a single predicate that succeeds on a given request iff all input predicates succeed
 * @param {Array} ps - list of predicates
 * @return {Predicate} - composite predicate
 */
function and() {
  // passing middleware will call this, alerting us of their result
  let succeed = () => true;
  return (req,res,next) => {
    for(let i = 0; i < arguments.length ; i ++){
      let result = arguments[i](req,res,succeed);
      if(!( result === true)){
        return result;
      }
    }
    next();
  };
}

// TODO: Documentation
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

function createModel(schema, data){
  let model = Object.assign({}, schema);
  for (let key of Object.keys(model)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      model[key] = data[key];
    }
  }
  return model;
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
  or,
  and,
  getResultErrors,
  createModel
};
