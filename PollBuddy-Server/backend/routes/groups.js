const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, debugRoute, promote, isLoggedIn} = require("../modules/utils"); // object destructuring, only import desired functions

// This file handles /api/groups URLs

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-new
 * @throws 405 - Route not used
 * @name GET api/groups/new
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/new", function (req, res) {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * Create a new group
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
    return res.status(200).send(createResponse({ID: result.insertedId}));   // return group ID
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idedit
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/edit", function (req, res) {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * Modify the group information 
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idedit
 * @typedef {Object} content
 * @property {String} Action - the action to be performed (should be "add" or "remove")
 * @property {String} Name - optional, the new name for the group
 * @property {String} Instructors - optional, the new instructor list for the group
 * @property {String} Polls - optional, the new list of poll ids for the group
 * @property {String} Users - optional, the new list of user ids for the group
 * @property {String} Admins - optional, the new list of admin ids for the group
 * @typedef {Object} payload
 * @param {String} id - the id of the group to edit
 * @param {content} body
 * @postdata {payload} payload
 * @throws 500 - An error occurred while writing to the database
 * @throws 400 - Invalid request body or ObjectID
 * @name POST api/groups/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/edit", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  const jsonContent = req.body;
  let success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Name !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$set": { Name: jsonContent.Name } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Instructors !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.status(400).send(createResponse(null,"Invalid request body or ObjectID"));
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Instructors !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      await mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse(null, "An error occurred while writing to the database"));
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.status(400).send(createResponse(null,"Invalid request body or ObjectID"));
    }
  } else {
    return res.status(400).send(createResponse(null,"Invalid request body or ObjectID"));
  }
  return res.status(200).send(createResponse("Success",));
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/delete", function (req, res) {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * Delete a group from the database
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-iddelete
 * @typedef {Object} payload
 * @property {String} id - id of the group to get information from
 * @postdata {payload} payload
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid ID.
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
    return res.status(200).send(createResponse("Success"));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
  }
});

/**
 * Get all groups in the database. This is a debug only endpoint
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-
 * @typedef {Object} Group
 * @property {String} _id
 * @property {String} Name
 * @property {String[]} Instructors
 * @property {String[]} Polls
 * @property {String[]} Users
 * @property {String[]} Admins
 * @returns {Group[]} response
 * @throws 500 - An error occurred while reading the database.
 * @name GET api/groups/
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/", async (req, res) => {
  debugRoute(req,res,async (req,res) => {
    try {
      const groups = await mongoConnection.getDB().collection("groups").find({}).toArray();
      return res.status(200).send(createResponse(groups));
    } catch (e) {
      console.log(e);
      return res.status(500).send(createResponse(null, "An error occurred while reading the database."));
    }
  });
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-
 * @throws 405 - Route not used
 * @name POST api/groups/
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/", function (req, res) {
  debugRoute(req,res,(req,res) => {
    res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
  });
});

/**
 * Get all group information
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-id
 * @typedef {Object} payload
 * @property {String} id - id of the group to get information from
 * @typedef {Object} Group
 * @property {String} _id
 * @property {String} Name
 * @property {String[]} Instructors
 * @property {String[]} Polls
 * @property {String[]} Users
 * @property {String[]} Admins
 * @getdata {payload} payload
 * @returns {Group} response
 * @throws 500 - An error occurred while accessing the database
 * @throws 400 - Invalid ID.
 * @name GET api/groups/{id}
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
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-id
 * @throws 405 - Route not used
 * @name POST api/groups/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * Get all polls linked to a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idpolls
 * @typedef {Object} payload
 * @property {String} id - id of the group to get information from
 * @typedef {Object} Group
 * @property {String[]} Polls
 * @getdata {payload} payload
 * @returns {Group} response
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid Invalid ID.
 * @name GET api/groups/{id}/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/polls", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    const Polls = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }, { _id: 0, Polls: 1 });
    return res.status(200).send(createResponse(Polls));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idpolls
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/polls", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * Get all users in a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idusers
 * @typedef {Object} payload
 * @property {String} id - id of the group to get information from
 * @typedef {Object} Group
 * @property {String[]} Users
 * @getdata {payload} payload
 * @returns {Group} response
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid ID.
 * @name GET api/groups/{id}/users
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/users", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    const Users = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }, { _id: 0, Users: 1 });
    return res.status(200).send(createResponse(Users));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idusers
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/users
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/users", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * Get all admins in a group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idadmins
 * @typedef {Object} payload
 * @property {String} id - id of the group to get information from
 * @typedef {Object} Group
 * @property {String[]} Admins
 * @getdata {payload} payload
 * @returns {Group} response
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid ID.
 * @name GET api/groups/{id}/admins
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/admins", async (req, res) => {
  const id = await validateID("groups", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  try {
    const Admins = await mongoConnection.getDB().collection("groups").findOne({ "_id": id }, { _id: 0, Admins: 1 });
    return res.status(200).send(createResponse(Admins));
  } catch(e) {
    console.log(e);
  }
  return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idadmins
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/admins
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/admins", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idjoin
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/join
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/join", async (req, res) => {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * Adds a user to the group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idjoin
 * @typedef {Object} payload
 * @property {String} userID - id of the user to add
 * @property {String} groupID - id of the group to add a user to
 * @postdata {payload} inputs
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid user ID.
 * @throws 400 - Invalid group ID.
 * @name POST api/groups/{id}/join
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/join", promote(isLoggedIn), async (req, res) => {
  const userID = await validateID("users", req.session.userData.userID);
  if (!userID) {
    return res.status(400).send(createResponse(null, "Invalid user ID."));
  }
  const groupID = await validateID("groups", req.params.id);
  if (!groupID) {
    return res.status(400).send(createResponse(null, "Invalid group ID."));
  }
  // Add user to group, do nothing if they are already in it
  try {
    await mongoConnection.getDB().collection("groups").updateOne({ "_id": groupID }, { $addToSet: { "Users": userID } });
    return res.status(200).send(createResponse(null));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while accessing the database."));
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idleave
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/leave
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/leave", async (req, res) => {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * removes user from the group
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idleave
 * @typedef {Object} payload
 * @property {String} userID - id of the user to remove
 * @property {String} groupID - id of the group to remove a user from
 * @postdata {payload} inputs
 * @throws 500 - An error occurred while accessing the database.
 * @throws 400 - Invalid user ID.
 * @throws 400 - Invalid group ID.
 * @name POST api/groups/{id}/leave
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/leave", promote(isLoggedIn), async (req, res) => {
  const userID = await validateID("users", req.session.userData.userID);
  if (!userID) {
    return res.status(400).send(createResponse(null, "User is not a member of this group."));
  }
  const groupID = await validateID("groups", req.params.id);
  if (!groupID) {
    return res.status(400).send(createResponse(null, "Invalid group ID."));
  }
  // remove user from the group
  try {
    await mongoConnection.getDB().collection("groups").updateOne({ "_id": groupID }, { $pull: { Users: userID } });
    return res.status(200).send(createResponse(null));
  } catch(e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "Database error occurred."));
  }
});


/**
 * Checks to see if the given user has access to the given group
 * @typedef {Object} payload
 * @property {String} userID - id of the user to look for
 * @property {String} groupID - id of the group to check
 * @returns {Boolean} response - True if the user has access, false otherwise
 */
function checkUserPermission(userID, groupID) { //TODO add checks to make sure IDs are valid
  var users = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Users":1})[0].Users; //get list of users
  for (var user in users) {
    if (user === userID) { //check for existence
      return true; //true if userID is found
    }
  }
  return false; //false if userID is not found
}

/**
 * Checks to see if the given user has admin access to the given group
 * @typedef {Object} payload
 * @property {String} adminID - id of the user to look for
 * @property {String} groupID - id of the group to check
 * @returns {Boolean} response - True if the user has admin access, false otherwise
 */
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
