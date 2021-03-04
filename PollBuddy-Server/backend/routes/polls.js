var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID} = require("../modules/utils"); // object destructuring, only import desired functions

router.post("/new", function (req, res) {
  // Validate request body
  const schema = Joi.object({
    Name: Joi.string().min(3).max(30).required()
  });
  const validResult = schema.validate(req.body);
  // invalidate handling
  if (validResult.error) {
    return res.status(404).send(createResponse(null, validResult.error.details[0].message));
  }

  // Add to DB
  mongoConnection.getDB().collection("polls").insertOne({Name: validResult.value.Name}, function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      if (result.result.ok !== 1) {
        // Failed to insert for some reason
        return res.sendStatus(500);
      } else {
        // Things seemed to be ok, send result message and ID of inserted object
        return res.send(createResponse({ID: result.insertedId}));
      }
    }
  });

});
router.post("/:id/edit", async (req, res) => {
  // validate request body
  const schema = Joi.object({
    Action: Joi.string().valid("add", "remove").required(), // two mode supported: 'add' or 'remove'
    Question: Joi.object().keys({
      QuestionText: Joi.string().min(3).max(512).required(),  // question text capped at 512 words
      AnswerChoices: Joi.array().items(Joi.string()).min(1).unique().required(),
      CorrectAnswers: Joi.array().items(Joi.string()).min(1).unique().required()
    }).required()
  });
  const validResult = schema.validate(req.body);
  // invalidate handling
  if (validResult.error) {
    return res.status(404).send(createResponse(null, validResult.error.details[0].message));
  }
  // validate id
  const id = await validateID("polls", req.params.id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }

  if (validResult.value.Action === "add") {
    // "Action": "add"
    try{
      await mongoConnection.getDB().collection("polls")
        .updateOne({"_id": id}, {"$addToSet": {Question: validResult.value.Question}});
      return res.status(200).send(createResponse(null));
    } catch(e) {
      return res.status(500).send(createResponse(null, e));
    }
  } else{
    // "Action": "remove"
    try {
      await mongoConnection.getDB().collection("polls")
        .updateOne({"_id": id}, {"$pull": {Question: ""}});
      return res.status(200).send(createResponse(null));
    } catch (e) {
      return res.status(500).send(createResponse(null, e));
    }
  }
});
router.post("/:id/submit", function (req, res) {
  const jsonContent = req.body;
  const pollId = new mongoConnection.getMongo().ObjectID(req.params.id);
  let data = {}; // Stores data being submitted to DB
  let insert = {}; // Stores insertion location

  // Check that pollId was specified and is valid
  if (pollId !== undefined) {
    mongoConnection.getDB().collection("polls").find({"_id": pollId}).toArray(function (err, result) {
      if (err) {
        return res.sendStatus(500);
      }
      if (result.length === 0) {
        return res.status(500).send({"Result": "Error", "Error": "Cannot find poll"});
      }
    });
  }

  // Check that answers were supplied in the correct format
  if (!jsonContent.Answers) {
    return res.status(500).send({"Result": "Error", "Error": "Answers not specified"});
  }
  if (!Array.isArray(jsonContent.Answers)) {
    return res.status(500).send({"Result": "Error", "Error": "Answers is not an array"});
  }
  if (jsonContent.Answers.empty) {
    return res.status(500).send({"Result": "Error", "Error": "Answers is empty"});
  }

  // Add timestamp to answers
  data.Answers = jsonContent.Answers;
  data.Timestamp = Date.now();

  // Check if the user is logged in or anonymous
  if (req.session.UserID) {
    // User is logged in, save with their ID
    insert["$and"] = [{"PollID": pollId}, {"UserID": jsonContent.UserID}];
  } else {
    insert["PollID"] = pollId;
  }

  // Save answers function for reducing code reuse
  let save = function () {
    mongoConnection.getDB().collection("poll_answers").updateOne(insert, {"$push": {"Answers": data}}, function (err3, result3) {
      if (err3) {
        return res.sendStatus(500);
      }
      if (result3.result.ok === 1) {
        return res.sendStatus(200);
      } else {
        return res.sendStatus(500);
      }
    });
  };

  // Check for existing answers and save new answers
  mongoConnection.getDB().collection("poll_answers").find(insert).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    if (result.length === 0) {
      // User/anonymous has not answered any questions in this poll yet, create a default set
      mongoConnection.getDB().collection("poll_answers").insertOne(insert, function (err2, result2) {
        if (err2) {
          return res.sendStatus(500);
        }
        if (result2.result.ok !== 1) {
          return res.sendStatus(500);
        }
        save();
      });

    } else {
      // User/anonymous has answered questions in this poll already, add to existing set
      save();
    }
  });

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
// GET polls listing.
router.get("/", function (req, res, next) {
  mongoConnection.getDB().collection("polls").find({}).toArray(function (err, result) {
    res.send(result);
  });
});
router.get("/:id", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  });
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
