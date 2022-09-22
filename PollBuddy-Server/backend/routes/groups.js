const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const {
  createResponse,
  isDevelopmentMode,
  isLoggedIn,
} = require("../modules/utils");
const {httpCodes, sendResponse} = require("../modules/httpCodes.js");
const {
  getGroupPolls,
  joinGroup,
  leaveGroup,
  deleteGroup,
  editGroup,
  editGroupValidator,
  createGroupValidator,
  getGroup,
  createGroup,
  getGroupMembers,
  getGroupAdmins,
  groupParamsValidator,
} = require("../models/Group");
const {paramValidator} = require("../modules/validatorUtils");

// This file handles /api/groups URLs

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-new
 * @throws 405 - Route not used
 * @name GET api/groups/new
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/new", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("GET is not available for this route. Use POST.")
  );
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
router.post("/new", isLoggedIn, async (req, res) => {
  let validResult = createGroupValidator.validate(req.body, {
    abortEarly: false,
  });
  if (validResult.error) {
    return sendResponse(res, httpCodes.BadRequest());
  }

  let response = await createGroup(
    req.session.userData.userID,
    validResult.value
  );
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
// eslint-disable-next-line no-unused-vars
router.get("/:id/edit", function (req, res) {
  return res
    .status(405)
    .send(
      createResponse(null, "GET is not available for this route. Use POST.")
    );
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
router.post(
  "/:id/edit",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let validResult = editGroupValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validResult.error) {
      return sendResponse(res, httpCodes.BadRequest());
    }

    let response = await editGroup(
      req.params.id,
      req.session.userData.userID,
      validResult.value
    );
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-iddelete
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/delete", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("GET is not available for this route. Use POST.")
  );
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
router.post(
  "/:id/delete",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    //use router.delete??
    let response = await deleteGroup(
      req.params.id,
      req.session.userData.userID
    );
    return sendResponse(res, response);
  }
);

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
// eslint-disable-next-line no-unused-vars
router.get("/", isDevelopmentMode, async (req, res) => {
  try {
    const groups = await mongoConnection
      .getDB()
      .collection("groups")
      .find({})
      .toArray();
    return res.status(200).send(createResponse(groups));
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send(
        createResponse(null, "An error occurred while reading the database.")
      );
  }
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-
 * @throws 405 - Route not used
 * @name POST api/groups/
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/", isDevelopmentMode, function (req, res) {
  res
    .status(405)
    .send(
      createResponse(null, "POST is not available for this route. Use GET.")
    );
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
router.get(
  "/:id",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await getGroup(req.params.id, req.session.userData.userID);
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-id
 * @throws 405 - Route not used
 * @name POST api/groups/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("POST is not available for this route. Use GET.")
  );
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
router.get(
  "/:id/polls",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await getGroupPolls(
      req.session.userData.userID,
      req.params.id
    );
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idpolls
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/polls", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("POST is not available for this route. Use GET.")
  );
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
router.get(
  "/:id/members",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await getGroupMembers(
      req.params.id,
      req.session.userData.userID
    );
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idusers
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/users
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/members", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("POST is not available for this route. Use GET.")
  );
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
router.get(
  "/:id/admins",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await getGroupAdmins(
      req.params.id,
      req.session.userData.userID
    );
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#post-idadmins
 * @throws 405 - Route not used
 * @name POST api/groups/{id}/admins
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/admins", function (req, res) {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("POST is not available for this route. Use GET.")
  );
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idjoin
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/join
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/join", async (req, res) => {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("GET is not available for this route. Use POST.")
  );
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
router.post(
  "/:id/join",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await joinGroup(req.params.id, req.session.userData.userID);
    return sendResponse(res, response);
  }
);

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Groups)#get-idleave
 * @throws 405 - Route not used
 * @name GET api/groups/{id}/leave
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/leave", async (req, res) => {
  return sendResponse(
    res,
    httpCodes.MethodNotAllowed("GET is not available for this route. Use POST.")
  );
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
router.post(
  "/:id/leave",
  isLoggedIn,
  paramValidator(groupParamsValidator),
  async (req, res) => {
    let response = await leaveGroup(req.params.id, req.session.userData.userID);
    return sendResponse(res, response);
  }
);

/**
 * Checks to see if the given user has access to the given group
 * @typedef {Object} payload
 * @property {String} userID - id of the user to look for
 * @property {String} groupID - id of the group to check
 * @returns {Boolean} response - True if the user has access, false otherwise
 */

function checkUserPermission(userID, groupID) {
  // TODO: add checks to make sure IDs are valid
  let users = mongoConnection
    .getDB()
    .collection("groups")
    .find({_id: groupID}, {_id: 0, Users: 1})[0].Users; //get list of users
  for (let user in users) {
    if (user === userID) {
      //check for existence
      return true; //true if userID is found
    }
  }
  return false; //false if userID is not found
}

module.exports = router;
