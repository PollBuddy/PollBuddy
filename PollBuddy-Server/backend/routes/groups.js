const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID} = require("../modules/utils"); // object destructuring, only import desired functions

/**
 * Modify the group information 
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-new
 * @typedef {Object} payload
 * @property {string} Name - Name of the new poll.
 * @typedef {Object} response
 * @property {string} ID - Object ID of the new poll
 * @postdata {payload} payload
 * @returns {response}
 * @throws 400 - Invalid request body, see error message for details.
 * @throws 500 - An error occurred while writing to the database.
 * @name POST api/polls/new
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
 router.post("/new", async (req, res) => {
  // Validate request body
  const schema = Joi.object({
    Name: Joi.string().min(3).max(30).required()
  });
  const validResult = schema.validate(req.body);
  // invalidate handling
  if (validResult.error) {
    return res.status(400).send(createResponse(null, validResult.error.details[0].message));
  }
  // Add to DB
  try {
    const result = await mongoConnection.getDB().collection("groups").insertOne({Name: validResult.value.Name});
    return res.send(createResponse({ID: result.insertedId}));   // return group ID
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
  }
});

/**
 * Modify the group information 
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idedit
 * @typedef {Object} payload
 * @property {String} Action
 * @property {String} Name
 * @property {String} Instructors
 * @property {String} Polls
 * @property {String} Users
 * @property {String} Admins
 * @postdata {payload} payload
 * @throws 500 - An error occured while writing to the database
 * @throws 400 - Invalid request body or ObjectID
 * @name POST api/groups/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/edit", function (req, res) {
  const id = new mongoConnection.getMongo().ObjectID(req.params.id);
  const jsonContent = req.body;
  let success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Name !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$set": { Name: jsonContent.Name } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.sendStatus(400);
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.sendStatus(400);
    }
  } else {
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});

/**
 * Delete a group from the database
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @typedef {Object} payload
 * @property {String} id
 * @postdata {payload} payload
 * @throws 500 - An error occured while accessing the database
 * @throws 400 - Invalid group id
 * @name POST api/groups/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/delete", async (req, res) => {//use router.delete??
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    await mongoConnection.getDB().collection("groups").deleteOne({ "_id": id });
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database"));
  }
});


router.get("/", function (req, res, next) {
  mongoConnection.getDB().collection("groups").find({}, { projection: { _id: 1 } }).map(function (item) {
    return item._id;
  }).toArray(function (err, result) {
    res.send(result);
  });
});

/**
 * Get all group information
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @typedef {Object} payload
 * @property {String} id
 * @getdata {payload} payload
 * @returns {Group} response
 * @throws 500 - An error occured while accessing the database
 * @throws 400 - Invalid group id
 * @name POST api/groups/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    const group = await mongoConnection.getDB().collection("polls").findOne({"_id": id});
    return res.status(200).send(createResponse(group));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database"));
  }
});

/**
 * Get all polls linked to a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @typedef {Object} payload
 * @property {String} id
 * @getdata {payload} payload
 * @returns {String[]} response
 * @throws 500 - An error occured while accessing the database
 * @throws 400 - Invalid group id
 * @name POST api/groups/{id}/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/polls", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    const Users = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }).Polls
    return res.status(200).send(createResponse(Users));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database"));
  }
});

/**
 * Get all users in a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @typedef {Object} payload
 * @property {String} id
 * @getdata {payload} payload
 * @returns {String[]} response
 * @throws 500 - An error occured while accessing the database
 * @throws 400 - Invalid group id
 * @name POST api/groups/{id}/users
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/users", async (req, res, next) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    var Users = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }).Users
    return res.status(200).send(createResponse(Users));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database"));
  }
});

/**
 * Get all admins in a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @typedef {Object} payload
 * @property {String} id
 * @getdata {payload} payload
 * @returns {String[]} response
 * @throws 500 - An error occured while accessing the database
 * @throws 400 - Invalid group id
 * @name POST api/groups/{id}/admins
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/admins", async (req, res, next) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    var Users = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }).Admins
    return res.status(200).send(createResponse(Users));
  } catch(e) {
    console.log(e);
  }
  return res.status(500).send(createResponse(null, "An error occurred while accessing the database"));
});

router.get("/id:/join", function (req, res, next) {
  return res.sendStatus(404);
});

/**
 * Adds user to group with given id
 */
router.post("/id:/join", function (res, req, next) {
  var userID = req.session["UserID"];
  if (userID === undefined) {
    res.status(401).send({ error: "Not logged in" });
  }
  
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  // Add user to group, do nothing if they are already in it
  mongoConnection.getDB().collection("groups").updateOne({ "_id:": id }, { $addToSet: { Users: userID } }, (err, res) => {
    if (err) {
      return res.status(500).send(err);
    }
    // Returns 1 if it was added, 0 if it already existed
    return res.status(200).send(res.result.nModified);
  });
});

//given a userID and a groupID, this function checks to see if the userID has access to the group
//first it finds the list of .Users data for the given groupID, then checks to see if the given userID is in that list 
function checkUserPermission(userID, groupID) { //TODO add checks to make sure IDs are valid
  var users = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Users":1})[0].Users; //get list of users
  for (var user in users) {
    if (user === userID) { //check for existence
      return true; //true if userID is found
    }
  }
  return false; //false if userID is not found
}

//given a adminID (really just a userID) and a groupID, this function checks to see if the adminID has admin access to the group
//first it finds the list of .Admins data for the given groupID, then checks to see if the given adminID is in that list
function checkAdminPermission(adminID, groupID) { //TODO add checks to make sure IDs are valid
  var admins = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Admins":1})[0].Admins; //get list of admins
  for (var admin in admins) {
    if (admin === adminID) { //check for existence
      return true; //true if adminID is found
    }
  }
  return false; //false if adminID is not found
}

module.exports = router;
