var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID, checkPollPublic, isLoggedIn} = require("../modules/utils"); // object destructuring, only import desired functions

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
    const result = await mongoConnection.getDB().collection("polls").insertOne({Name: validResult.value.Name});
    return res.send(createResponse({ID: result.insertedId}));   // return poll ID
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
  }
});

/**
 * Modify (add|delete|edit) Questions of a specific poll.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#post-idedit
 * @typedef {Object} Questions
 * @property {number} QuestionNumber - Number of the question.
 * @property {string} QuestionText - Content of the question.
 * @property {string[]} AnswerChoices - Array of possible choices or null.
 * @property {string[]} CorrectAnswers - Array of correct answers or null.
 * @property {string} Visible - Whether students will be able to see the graded result or not.
 * @postdata {Questions[]} payload
 * @throws 400 - Invalid request body or ObjectID, see error message for details.
 * @throws 500 - An error occurred while writing to the database.
 * @name POST api/polls/{id}/edit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/edit", async (req, res) => {
  // validate request body
  const schema = Joi.array().items(
    Joi.object().keys({
      QuestionNumber: Joi.number().min(1).required(), // number index starting from 1
      QuestionText: Joi.string().min(1).max(512).required(),  // question text capped at 512 words
      AnswerChoices: Joi.array().items(Joi.string()).unique().allow(null).required(), // null for open-ended
      CorrectAnswers: Joi.array().items(Joi.string()).unique().allow(null).required(),  // null for no-grading
      Visible: Joi.boolean().required()
    })
  );
  const validResult = schema.validate(req.body);
  // invalidate handling
  if (validResult.error) {
    return res.status(400).send(createResponse(null, validResult.error.details[0].message));
  }
  // validate id
  const id = await validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  // generate ObjectID for embedded Questions
  validResult.value.forEach((o, i, a) => {
    a[i]["_id"] = new mongoConnection.getMongo().ObjectID();
  });
  // update Questions content
  try {
    await mongoConnection.getDB().collection("polls").updateOne({"_id": id}, {"$set": {Questions: validResult.value}});
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
  }
  return res.status(200).send(createResponse());
});

/**
 * Submit/re-submit poll answer.
 * Depending on the "Pubic" attribute of the poll it might requires sign-in.
 * @typedef {Object} Answers
 * @property {string} QuestionID - ID of the question.
 * @property {string} Answer - Answer response, could be null or empty string.
 * @postdata {Answers[]} payload
 * @throws 400 - Invalid ID.
 * @throws 403 - Sign-In required.
 * @throws 500 - An error occurred while reading the database.
 * @throws 500 - An error occurred while writing to the database.
 * @name POST api/polls/{id}/submit
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.post("/:id/submit", checkPollPublic, async (req, res) => {
  // validate request body
  const schema = Joi.array().items(
    Joi.object().keys({
      QuestionID: Joi.string().required(),
      Answer: Joi.string().allow(null, "").required() // allow empty string or null
    })
  );
  const validResult = schema.validate(req.body);
  // invalidate handling
  if (validResult.error) {
    return res.status(400).send(createResponse(null, validResult.error.details[0].message));
  }
  // add poll ID
  validResult.value.PollID = req.parsedID;
  // add timestamp
  validResult.value.Timestamp = Date.now();
  // check if user is signed in
  if (isLoggedIn(req)) {
    // write UserID
    validResult.value.UserID = req.session.userData.userID;
    // check for resubmit
    try {
      await mongoConnection.getDB().collection("poll_answers").findOneAndUpdate({
        PollID: validResult.value.PollID,
        UserID: validResult.value.UserID
      }, {...validResult.value});
      return res.send(createResponse());
    } catch(e) {
      console.log(e);
      return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
    }
  } else {
    // anonymous submission, no resubmit
    try {
      await mongoConnection.getDB().collection("poll_answers").insertOne({...validResult.value});
      return res.send(createResponse());
    } catch(e) {
      console.log(e);
      return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
    }
  }
});


router.get("/pollAnswers", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("poll_answers").deleteOne({"_id": id}, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  return res.sendStatus(200);
});
router.post("/:id/delete", function (req, res) {//use router.delete??
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").deleteOne({"_id": id}, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  return res.sendStatus(200);
});

/**
 * Get all polls.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-
 * @typedef {Object} Poll
 * @property {string} _id Object ID of the poll.
 * @property {string} Name of the poll.
 * @property {Questions[]} Array of Questions
 * @returns {Poll[]} response
 * @throws 500 - An error occurred while reading the database.
 * @name GET api/polls
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/", async (req, res) => {
  try {
    const polls = await mongoConnection.getDB().collection("polls").find({}).toArray();
    return res.status(200).send(createResponse(polls));
  } catch (e) {
    console.log(e);
  }
  return res.status(500).send(createResponse(null, "An error occurred while reading the database."));
});

/**
 * Get data of a single poll with the specified id.
 * For full documentation see the wiki https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Polls)#get-id
 * @returns {Poll} response
 * @throws 400 - Invalid ObjectID.
 * @throws 500 - An error occurred while reading the database.
 * @name GET api/polls/{id}
 * @param {string} path - Express path.
 * @param {function} callback - Function handler for endpoint.
 */
router.get("/:id", async (req, res) => {
  // validate id
  const id = await validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }
  // query poll
  try {
    const poll = await mongoConnection.getDB().collection("polls").findOne({"_id": id});
    return res.status(200).send(createResponse(poll));
  } catch (e) {
    console.log(e);
  }
  return res.status(500).send(createResponse(null, "An error occurred while reading the database."));
});

router.get("/:id/view", function (req, res, next) {
  const id = validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }

  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    // Loop through the poll's questions and add to openQuestions the Question Number, Text and Answer Choices if
    // the question is set as Visible.
    let openQuestions = [];
    for (let i = 0; i < result[0].Questions.length; i++) {
      if (result[0].Questions[i][0].Visible) {
        let q = {};
        q.QuestionNumber = result[0].Questions[i][0].QuestionNumber;
        q.QuestionText = result[0].Questions[i][0].QuestionText;
        q.AnswerChoices = result[0].Questions[i][0].AnswerChoices;
        q.MaxAllowedChoices = result[0].Questions[i][0].MaxAllowedChoices;
        q.TimeLimit = result[0].Questions[i][0].TimeLimit;
        openQuestions.push(q);
      }
    }
    // Send the open questions
    res.send({"Questions": openQuestions, "PollID": id});
  });
});

router.get("/:id/results", function (req, res, next) {
  const id = validateID("polls", id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }

  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    mongoConnection.getDB().collection("poll_answers").find({"PollID": id}).toArray(function (err2, result2) {
      if (err2) {
        return res.sendStatus(500);
      }

      // Loop through the poll's questions and add to openQuestions the Question Number, Text and Answer Choices if
      // the question is set as Visible.
      let results = [];
      for (let i = 0; i < result[0].Questions.length; i++) {
        if (result[0].Questions[i][0].Visible) {
          let q = {};
          q.QuestionNumber = result[0].Questions[i][0].QuestionNumber;
          q.QuestionText = result[0].Questions[i][0].QuestionText;
          q.CorrectAnswers = result[0].Questions[i][0].CorrectAnswers;
          q.AnswerChoices = [];
          q.Tallies = [];

          // Add and tally answers
          for (let k = 0; k < result[0].Questions[i][0].AnswerChoices.length; k++) {
            q.AnswerChoices.push(result[0].Questions[i][0].AnswerChoices[k]);
            let tally = 0;
            for (let j = 0; j < result2[0].Answers.length; j++) {
              if (result2[0].Answers[j].Answers[0].Answer === q.AnswerChoices[k]) {
                tally++;
              }
            }
            q.Tallies.push(tally);
          }

          results.push(q);
        }
      }
      // Send the open questions
      res.send({"Results": results});
    });
  });
});

module.exports = router;
