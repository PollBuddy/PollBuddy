const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const {
  isLoggedIn,
  isDevelopmentMode,
} = require("../modules/utils");
const {sendResponse, httpCodes} = require("../modules/httpCodes.js");
const {
  createPoll, getPoll, editPoll, createPollValidator, editPollValidator, createQuestionValidator, createQuestion,
  editQuestionValidator, editQuestion, submitQuestionValidator, submitQuestion, getPollResults, getPollResultsCSV,
  deletePoll, pollParamsValidator
} = require("../models/Poll");
const {paramValidator, bodyValidator} = require("../modules/validatorUtils");
const {Parser} = require("json2csv");
const {getPollInternal} = require("../modules/modelUtils");
const sanitize = require("sanitize-filename");

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
router.get("/new", (req, res) => {
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
router.post("/new", isLoggedIn, bodyValidator(createPollValidator), async (req, res) => {
  let result = await createPoll(req.session.userData.userID, req.body);
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
router.get("/:id/edit", (req, res) => {
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
router.post("/:id/edit", isLoggedIn, paramValidator(pollParamsValidator), bodyValidator(editPollValidator), async (req, res) => {
  let response = await editPoll(req.session.userData.userID, req.params.id, req.body);
  return sendResponse(res, response);
});

// eslint-disable-next-line no-unused-vars
router.get("/:id/createQuestion", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/createQuestion", isLoggedIn, paramValidator(pollParamsValidator), bodyValidator(createQuestionValidator), async (req, res) => {
  let response = await createQuestion(req.session.userData.userID, req.params.id, req.body);
  return sendResponse(res, response);
});

// eslint-disable-next-line no-unused-vars
router.get("/:id/editQuestion", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/editQuestion", isLoggedIn, paramValidator(pollParamsValidator), bodyValidator(editQuestionValidator), async (req, res) => {
  let response = await editQuestion(req.session.userData.userID, req.params.id, req.body);
  return sendResponse(res, response);
});

// eslint-disable-next-line no-unused-vars
router.get("/:id/submitQuestion", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/submitQuestion", paramValidator(pollParamsValidator), bodyValidator(submitQuestionValidator), async (req, res) => {
  let userID = null;
  if (req.session.userData && req.session.userData.userID) {
    userID = req.session.userData.userID;
  }

  let response = await submitQuestion(userID, req.params.id, req.body);
  return sendResponse(res, response);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-iddelete
 * @throws 405 - Route not used
 * @name GET api/polls/{id}/delete
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/delete", (req, res) => {
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
    return sendResponse(res, httpCodes.Ok(polls));
  } catch (e) {
    console.log(e);
  }
  return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
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
router.post("/", isDevelopmentMode, (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
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
// eslint-disable-next-line no-unused-vars
router.post("/:id", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * Calculate and output the correct results or error-handling messages for the poll answers
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
// eslint-disable-next-line no-unused-vars
router.post("/:id/results", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * Calculate and output the correct results or error-handling messages for the poll answers, but in CSV format
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-idcsv
 * @returns {Poll} results
 * @throws 400 - Invalid ObjectID.
 * @throws 500 - ObjectID could not be found in polls or poll_answers.
 * @name GET api/polls/{id}/csv
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id/csv", isLoggedIn, paramValidator(pollParamsValidator), async (req, res) => {

  let data = await getPollResultsCSV(req.session.userData.userID, req.params.id);
  let poll = await getPollInternal(req.params.id);

  // Set up the static fields
  const fields = ["QuestionNumber", "QuestionText", "UserName", "Email", "FirstName", "LastName", "SchoolAffiliation", "AnswerText", "Correct"];

  const opts = {fields};

  const json2csv = new Parser(opts);
  const csv = json2csv.parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment(sanitize("Poll Results for " + poll.Title + " - Poll Buddy.csv"));
  return res.send(csv);
});

/**
 * This route is not used.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-idresults
 * @throws 405 - Route not used
 * @name POST api/polls/{id}/csv
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/csv", (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

module.exports = router;
