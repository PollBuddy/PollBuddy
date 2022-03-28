const express = require("express");
const mongoConnection = require("../modules/mongoConnection");
const {createResponse, isLoggedIn, promote, isDevelopmentMode} = require("../modules/utils");
const {createPoll, getPoll, editPoll, createPollValidator, editPollValidator, createQuestionValidator, createQuestion,
  editQuestionValidator, editQuestion, submitQuestionValidator, submitQuestion, getPollResults, deletePoll, pollParamsValidator
} = require("../models/Poll");
const {sendResponse, httpCodes} = require("../modules/httpCodes");
const {paramValidator} = require("../modules/validatorUtils");

// This file handles /api/polls URLs

const router = express.Router();

router.get("/new", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/new", promote(isLoggedIn), async (req, res) => {
  let validResult = createPollValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let result = await createPoll(req.session.userData.userID, validResult.value);
  return sendResponse(res, result);
});

router.get("/:id", paramValidator(pollParamsValidator), async (req, res) => {
  let userID = null;
  if (req.session.userData && req.session.userData.userID) {
    userID = req.session.userData.userID;
  }

  let result = await getPoll(userID, req.params.id);
  return sendResponse(res, result);
});

router.post("/:id", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

router.get("/:id/results", promote(isLoggedIn), paramValidator(pollParamsValidator), async (req, res) => {
  let response = await getPollResults(req.session.userData.userID, req.params.id);
  return sendResponse(res, response);
});

router.post("/:id/results", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});


router.get("/:id/edit", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/edit", promote(isLoggedIn), paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = editPollValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await editPoll(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/:id/delete", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/delete", promote(isLoggedIn), paramValidator(pollParamsValidator), async (req, res) => {
  let response = await deletePoll(req.session.userData.userID, req.params.id);
  return sendResponse(res, response);
});

router.get("/:id/createQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/createQuestion", promote(isLoggedIn), paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = createQuestionValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await createQuestion(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/:id/editQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/editQuestion", promote(isLoggedIn), paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = editQuestionValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let response = await editQuestion(req.session.userData.userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/:id/submitQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:id/submitQuestion", paramValidator(pollParamsValidator), async (req, res) => {
  let validResult = submitQuestionValidator.validate(req.body, { abortEarly: false });
  if (validResult.error) { return sendResponse(res, httpCodes.BadRequest()); }

  let userID = null;
  if (req.session.userData && req.session.userData.userID) {
    userID = req.session.userData.userID;
  }

  let response = await submitQuestion(userID, req.params.id, validResult.value);
  return sendResponse(res, response);
});

router.get("/", promote(isDevelopmentMode), async (req, res) => {
  try {
    const polls = await mongoConnection.getDB().collection("polls").find({}).toArray();
    return sendResponse(res, httpCodes.Ok(polls));
  } catch (e) {
    console.error(e);
    return sendResponse(res, httpCodes.InternalServerError());
  }
});

router.post("/", promote(isDevelopmentMode), function (req, res) {
  res.status(405).send(createResponse(null, "POST is not available for this route. Use GET."));
});

module.exports = router;
