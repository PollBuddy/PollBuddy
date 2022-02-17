const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, debugRoute, getResultErrors, promote, isLoggedIn, isEmpty} = require("../modules/utils");
const {userRegisterValidator, getUser} = require("../models/User.js");
const {createGroupValidator, getGroup, createGroup, getGroupUsers, getGroupAdmins} = require("../models/Group.js"); // object destructuring, only import desired functions
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");
const {getGroupPolls, joinGroup, leaveGroup, deleteGroup} = require("../models/Group");

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
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
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
router.post("/new", promote(isLoggedIn), async (req, res) => {
  let validResult = createGroupValidator.validate({
    name: req.body.name,
    description: req.body.description,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  let errorMsg = {};
  if (errors["name"]) { errorMsg["name"] = "Invalid group name!"; }
  if (errors["description"]) { errorMsg["description"] = "Invalid group description!"; }
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await createGroup(validResult.value, req.session.userData.userID);
  return sendResponse(res, response);
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
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
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
  let response = await deleteGroup(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
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
router.get("/:id", promote(isLoggedIn), async (req, res) => {
  let response = await getGroup(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
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
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
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
  let response = await getGroupPolls(req.params.id);
  return sendResponse(res, response);
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
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
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
router.get("/:id/users", promote(isLoggedIn), async (req, res) => {
  let response = await getGroupUsers(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
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
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
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
router.get("/:id/admins", promote(isLoggedIn), async (req, res) => {
  let response = await getGroupAdmins(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
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
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
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
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
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
  let response = await joinGroup(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
});

router.get("/:id/leave", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/leave", promote(isLoggedIn), async (req, res) => {
  let response = await leaveGroup(req.params.id, req.session.userData.userID);
  return sendResponse(res, response);
});

module.exports = router;
