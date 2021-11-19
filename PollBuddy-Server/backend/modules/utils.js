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

// check if user is logged in. returns true or false.
isLoggedIn = (req) => {
  if(req.session.userData && req.session.userData.userID)
  {
    return true;
  } else {
    req.status(401).send(createResponse(null, "User is not logged in."));
    return false;
  }
}

isDevelopmentMode = (req) => {
  return process.env.DEVELOPMENT_MODE === "true"
}

function promote(p) {
  or([p]);
}
// takes in a list of functions of a request object
// produces middleware that runs each of the functions on its req in order
// if any of the functions return true, calls next, otherwise drops the request
function or(ps) {
  return (req,res,next) => {
    for(var i = 0; i < ps.length ; i++){
      if(ps(req) == true){
        next()
      }
    }
  }
}


module.exports = {
  createResponse,
  validateID,
  isLoggedIn,
  checkPollPublic,
  isEmpty
};