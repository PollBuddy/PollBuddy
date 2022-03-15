var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, checkPollPublic, isLoggedIn, promote, debugRoute, getResultErrors, isEmpty} = require("../modules/utils");
const {sendResponse, httpCodes} = require("../modules/httpCodes.js");
const {createPoll, getPoll, editPoll, createPollValidator, editPollValidator, createQuestionValidator, createQuestion,
  editQuestionValidator, editQuestion, submitQuestionValidator, submitQuestion, getPollResults, deletePoll
} = require("../models/Poll");

router.get("/new", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/new", promote(isLoggedIn), async (req, res) => {
  let validResult = createPollValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest()); }

  let result = await createPoll(req.session.userData.userID, validResult.value);
  return sendResponse(res, result);
});

router.get("/:pollID", promote(isLoggedIn), async (req, res) => {
  let result = await getPoll(req.session.userData.userID, req.params.pollID);
  return sendResponse(res, result);
});

router.post("/:pollID", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});


router.get("/:pollID/edit", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/edit", promote(isLoggedIn), async (req, res) => {
  let validResult = editPollValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await editPoll(req.session.userData.userID, req.params.pollID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/delete", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/delete", promote(isLoggedIn), async (req, res) => {
  let response = await deletePoll(req.session.userData.userID, req.params.pollID);
  return sendResponse(res, response);
});

router.get("/:pollID/createQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/createQuestion", promote(isLoggedIn), async (req, res) => {
  let validResult = createQuestionValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await createQuestion(req.session.userData.userID, req.params.pollID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/editQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/editQuestion", promote(isLoggedIn), async (req, res) => {
  let validResult = editQuestionValidator.validate(req.body, { abortEarly: false });

  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await editQuestion(req.session.userData.userID, req.params.pollID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/submitQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/submitQuestion", promote(isLoggedIn), async (req, res) => {
  let validResult = submitQuestionValidator.validate(req.body, { abortEarly: false });
  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await submitQuestion(req.session.userData.userID, req.params.pollID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/results", promote(isLoggedIn), async (req, res) => {
  let response = await getPollResults(req.params.pollID, req.session.userData.userID);
  return sendResponse(res, response);
});

router.post("/:pollID/results", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});


module.exports = router;
