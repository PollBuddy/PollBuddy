const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, checkPollPublic, isLoggedIn, isDevelopmentMode, getResultErrors, isEmpty} = require("../modules/utils");
const {sendResponse, httpCodes} = require("../modules/httpCodes.js");
const {createPoll, getPoll, editPoll, createPollValidator, editPollValidator, createQuestionValidator, createQuestion,
  editQuestionValidator, editQuestion, submitQuestionValidator, submitQuestion, getPollResults, deletePoll, pollParamsValidator
} = require("../models/Poll");
const {paramValidator} = require("../modules/validatorUtils");

// This file handles /api/polls URLs

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-new
 * @throws 405 - Route not used
 * @name GET api/polls/new
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/new", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * Create new poll.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-new
 * @typedef {Object} payload
 * @property {string} Name - Name of the new poll.
 * @typedef {Object} response
 * @property {string} ID - Object ID of the new poll
 * @postdata {payload} payload
 * @returns {response}
 * @throws 400 - Invalid request body, see error message for details.
 * @throws 500 - An error occurred while communicating with the database.
 * @name POST api/polls/new
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/new", isLoggedIn, async (req, res) => {
  let validResult = createPollValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let result = await createPoll(req.session.userData.userID, validResult.value);
  return sendResponse(res, result);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-idedit
 * @throws 405 - Route not used
 * @name GET api/polls/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/edit", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * Modify Name, Public, ShortCodes, Admins, Group, and (add|delete|edit) Questions of a specific poll.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-idedit
 * @typedef {Object} Questions
 * @property {number} QuestionNumber - Number of the question.
 * @property {string} QuestionText - Content of the question.
 * @property {string[]} AnswerChoices - Array of possible choices or null.
 * @property {string[]} CorrectAnswers - Array of correct answers or null.
 * @property {string} Visible - Whether students will be able to see the graded result or not.
 * @typedef {Object} ShortCode
 * @property {string} Code - Short code.
 * @property {Date} ValidFrom - Valid starting time for the code. (optional)
 * @property {Date} ValidTo - Expiry for the code. (optional)
 * @property {string[]} ValidUsers - Valid users ID that are allowed to use this code. (optional)
 * @property {number} UseCounter - Starts at 0 and counts up each time it's used. (optional)
 * @typedef {Object} Poll
 * @property {string} Name - New name (optional)
 * @property {boolean} Public - Allow anonymous (true) or not. (optional)
 * @property {ShortCode[]} ShortCodes - Array of shortcodes (optional)
 * @property {string[]} Admins - Array of admins ID. (optional)
 * @property {string} Group - Group ID (optional)
 * @property {Questions[]} Questions - Array of Questions (optional)
 * @postdata {Poll} payload
 * @throws 400 - Invalid request body or ObjectID, see error message for details.
 * @throws 500 - An error occurred while communicating with the database.
 * @name POST api/polls/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/edit", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = editPollValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await editPoll(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-idsubmit
 * @throws 405 - Route not used
 * @name GET api/polls/{id}/submit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/submit", function (req, res) {
  return res.status(405).send(createResponse(null, "GET is not available for this route. Use POST."));
});


router.get("/:id/createQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/createQuestion", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = createQuestionValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await createQuestion(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/:id/editQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/editQuestion", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = editQuestionValidator.validate(req.body, { abortEarly: false });
  console.log(validResult);

  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await editQuestion(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/:id/submitQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/submitQuestion", paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = submitQuestionValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let userID = null;
  if (req.session.userData && req.session.userData.userID) {
    userID = req.session.userData.userID;
  }

  let response = await submitQuestion(userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

/**
* Get the answers of a poll, using its specified id
* For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-pollAnswers
* @property {string} id - ID of the poll.
* @throws 500 - An error occurred while communicating with the database.
* @returns {Poll} response
* @param {string} path - Express path.
* @name GET api/polls/pollAnswers
* @param {function} callback - Function handler for endpoint.
*/
router.get("/pollAnswers", function (req, res) {
  let id = new mongoConnection.getMongo().ObjectID(req.params.id);
  // eslint-disable-next-line no-unused-vars
  mongoConnection.getDB().collection("poll_answers").deleteOne({"_id": id}, function (err, _res) {
    if (err) {
      return res.status(500).send(createResponse("", err)); // TODO: Error message
    }
  });
  return res.status(200).send(createResponse("", "")); // TODO: Success message;
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-pollAnswers
 * @throws 405 - Route not used
 * @name POST api/polls/pollAnswers
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/pollAnswers", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-iddelete
 * @throws 405 - Route not used
 * @name GET api/polls/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/delete", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * Delete a poll from the collection of polls, using its specified id
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-iddelete
 * @property {string} id - ID of the poll.
 * @throws 500 - An error occurred while communicating with the database.
 * @returns {Poll} response
 * @name POST api/polls/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/delete", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {
  let response = await deletePoll(req.session.userData.userID, req.params.id);
  return sendResponse(res, response);
});

/**
 * Get all polls.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-
 * @typedef {Object} Poll
 * @property {string} _id Object ID of the poll.
 * @property {string} Name of the poll.
 * @property {Questions[]} Array of Questions
 * @returns {Poll[]} response
 * @throws 500 - An error occurred while communicating with the database.
 * @name GET api/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/", isDevelopmentMode, async (req, res) => {
  try {
    const polls = await mongoConnection.getDB().collection("polls").find({}).toArray();
    return res.status(200).send(createResponse(polls));
  } catch (e) {
    console.log(e);
  }
  return res.status(500).send(createResponse(null, "An error occurred while communicating with the database."));
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-
 * @throws 405 - Route not used
 * @name POST api/polls/
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/", isDevelopmentMode, function (req, res) {
  res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * Get data of a single poll with the specified id.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-id
 * @returns {Poll} response
 * @throws 400 - Invalid ObjectID.
 * @throws 500 - An error occurred while communicating with the database.
 * @name GET api/polls/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id", paramValidator(pollParamsValidator), async (req, res) => {
  let userID = null;
  if (req.session.userData && req.session.userData.userID) {
    userID = req.session.userData.userID;
  }
  let result = await getPoll(userID, req.params.id);
  return sendResponse(res, result);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-id
 * @throws 405 - Route not used
 * @name POST api/polls/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * Validate a specified ID for a poll, and send questions to the poll.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-idview
 * @returns {Poll} openQuestions
 * @throws 400 - Invalid Poll ID
 * @throws 500 - Failed connection to the poll database
 * @name POST api/polls/{id}/view
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/view", checkPollPublic, async function (req, res) {
  const id = await validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }

  //console.log(id);
  //console.log(req.params.id);

  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("", err)); // TODO: Error message;
    }

    //console.log(result);
    //console.log(result[0]);
    //console.log(result[0].Questions[0]);

    // Loop through the poll's questions and add to openQuestions the QuestionResults Number, Text and Answer Choices if
    // the question is set as Visible.
    let openQuestions = [];
    for (let i = 0; i < result[0].Questions.length; i++) {
      if (result[0].Questions[i].Visible) {
        let q = {};
        q.QuestionNumber = result[0].Questions[i].QuestionNumber;
        q.QuestionText = result[0].Questions[i].QuestionText;
        q.AnswerChoices = result[0].Questions[i].AnswerChoices;
        q.MaxAllowedChoices = result[0].Questions[i].MaxAllowedChoices;
        q.TimeLimit = result[0].Questions[i].TimeLimit;
        openQuestions.push(q);
      }
    }
    // Send the open questions
    res.status(200).send(createResponse({"Questions": openQuestions, "PollID": id}));
  });
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-idview
 * @throws 405 - Route not used
 * @name POST api/polls/{id}/view
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/view", function (req, res) {
  return res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

/**
 * Calculate and output the correct results or error-handling messages
 * for the poll answers
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-idresults
 * @returns {Poll} results
 * @throws 400 - Invalid ObjectID.
 * @throws 500 - ObjectID could not be found in polls or poll_answers.
 * @name GET api/polls/{id}/results
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/results", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {
  let response = await getPollResults(req.session.userData.userID, req.params.id);
  return sendResponse(res, response);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-idresults
 * @throws 405 - Route not used
 * @name POST api/polls/{id}/results
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/results", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

// Given a userID and a pollID, this function returns true if the user has permission to access the poll, and false otherwise.
// If the poll is linked to a group (there is information in the .Group data), the group is checked for user access permissions.
// If the poll is not linked, it returns true by default.
function checkUserPermission(userID, pollID) { //TODO add checks to make sure IDs are valid
  const groupID = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id": 0, "Groups": 1})[0].Group; //get groupID attached to poll
  if (groupID !== undefined && groupID.length !== 0) {
    // groupID returned something
    const users = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id": 0, "Users": 1})[0].Users; //get list of users in group
    for (let user in users) {
      if (user === userID) {
        return true;
      }
    }
    return false;
  }
  // Return true if the poll isn't linked to a group
  return true;
}

// Given an adminID (really just a userID) and a pollID, this function returns true if the user has admin permissions for the poll, and false otherwise.
// If the poll is linked to a group (there is information in the ".Group" data), the group is checked for admin access.
// If the poll is not linked, it checks the internal .Admin data and returns true see if it finds the adminID, and false otherwise.
function checkAdminPermission(adminID, pollID) { //TODO add checks to make sure IDs are valid
  let groupID = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id": 0, "Groups": 1})[0].Group; //get groupID attached to the poll
  if (groupID.length === 0 || groupID.length === undefined) { //groupID returned something
    let admins = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id": 0, "Admins": 1})[0].Admins; //get list of admins in attached group
    for (let admin in admins) {
      if (admin === adminID) { //check for adminID in list
        return true;
      }
    }
  } else { //groupID didn't return something
    let admins = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id": 0, "Admins": 1})[0].Admins; //get internal list of Admins
    for (let admin in admins) {
      if (admin === adminID) { //check for adminID in list
        return true;
      }
    }
  }

  return false; //adminID wasn't found
}

module.exports = router;
