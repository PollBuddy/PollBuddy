var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, checkPollPublic, isLoggedIn, promote, debugRoute, getResultErrors, isEmpty} = require("../modules/utils");
const {sendResponse, httpCodes} = require("../modules/httpCodes.js");
const {createPoll, getPoll, editPoll, createPollValidator, editPollValidator, createQuestionValidator, createQuestion,
  editQuestionValidator, editQuestion
} = require("../models/Poll");

router.get("/new", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/new", promote(isLoggedIn), async (req, res) => {
  let validResult = createPollValidator.validate({
    title: req.body.title,
    description: req.body.description,
    group: req.body.group,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  let errorMsg = {};
  if (errors["title"]) { errorMsg["title"] = "Invalid poll title!"; }
  if (errors["description"]) { errorMsg["description"] = "Invalid poll description!"; }
  if (errors["group"]) { errorMsg["description"] = "Invalid Group ID!"; }
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let result = await createPoll(req.session.userData.userID, validResult.value);
  return sendResponse(res, result);
});

router.get("/:pollID", promote(isLoggedIn), async (req, res) => {
  let result = await getPoll(req.params.pollID, req.session.userData.userID);
  return sendResponse(res, result);
});

router.post("/:pollID", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});


router.get("/:pollID/edit", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/edit", promote(isLoggedIn), async (req, res) => {
  let validResult = editPollValidator.validate({
    title: req.body.title,
    description: req.body.description,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await editPoll(req.params.pollID, req.session.userData.userID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/createQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/createQuestion", promote(isLoggedIn), async (req, res) => {
  let validResult = createQuestionValidator.validate({
    text: req.body.text,
    answers: req.body.answers,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await createQuestion(req.params.pollID, req.session.userData.userID, validResult.value);
  return sendResponse(res, response);
});

router.get("/:pollID/editQuestion", async (req, res) => {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

router.post("/:pollID/editQuestion", promote(isLoggedIn), async (req, res) => {
  let validResult = editQuestionValidator.validate({
    id: req.body.id,
    text: req.body.text,
    answers: req.body.answers,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  if (!isEmpty(errors)) { return sendResponse(res, httpCodes.BadRequest(errors)); }

  let response = await editQuestion(req.params.pollID, req.session.userData.userID, validResult.value);
  return sendResponse(res, response);
});

module.exports = router;
