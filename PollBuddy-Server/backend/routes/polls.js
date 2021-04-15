var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");
const Joi = require("joi");
const {createResponse, validateID} = require("../modules/utils"); // object destructuring, only import desired functions

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
  validResult.value.forEach((o,i,a) => {
    a[i]["_id"] = new mongoConnection.getMongo().ObjectID();
  });
  // update Questions content
  try {
    await mongoConnection.getDB().collection("polls").updateOne({"_id": id}, {"$set": {Questions: validResult.value}});
  } catch (e) {
    console.log(e);
    return res.status(500).send(createResponse(null, "An error occurred while writing to the database."));
  }

  var id2 = new mongoConnection.getMongo().ObjectID(req.params.id);
  var jsonContent = req.body;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Questions !== undefined) {//QUESTION IS AN OBJECT https://docs.google.com/document/d/1kFdjwiE4_POgcTDqXK-bcnz4RAeLG6yaF2RxLzkNDrE/edit
      mongoConnection.getDB().collection("polls").updateOne({ "_id": id2 }, { "$addToSet": { Questions: jsonContent.Questions } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    }
    if (jsonContent.Group !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id2 }, { "$addToSet": { Group: jsonContent.Group } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    } 
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id2 }, { "$addToSet": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    } else {
      return res.status(400).send(createResponse("","")); // TODO: Error message
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Questions !== undefined) {
      mongoConnection.getDB().collection("polls").updateOne({ "_id": id2 }, { "$pull": { Questions: "" } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    } 
    if (jsonContent.Group !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id2 }, { "$pull": { Group: jsonContent.Group } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id2 }, { "$pull": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("",err)); // TODO: Error message
        }
      });
    } else {
      return res.status(400).send(createResponse("","")); // TODO: Error message
    }
  } else {
    return res.status(400).send(createResponse("","")); // TODO: Error message
  }
  return res.status(200).send(createResponse());
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
        return res.status(500).send(createResponse("","")); // TODO: Error message
      }
      if (result.length === 0) {
        return res.status(500).send(createResponse({"Result": "Error", "Error": "Cannot find poll"}));
      }
    });
  }

  // Check that answers were supplied in the correct format
  if (!jsonContent.Answers) {
    return res.status(500).send(createResponse({"Result": "Error", "Error": "Answers not specified"}));
  }
  if (!Array.isArray(jsonContent.Answers)) {
    return res.status(500).send(createResponse({"Result": "Error", "Error": "Answers is not an array"}));
  }
  if (jsonContent.Answers.empty) {
    return res.status(500).send(createResponse({"Result": "Error", "Error": "Answers is empty"}));
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
        return res.status(500).send(createResponse("",err3)); // TODO: Error message
      }
      if (result3.result.ok === 1) {
        return res.status(200).send(createResponse("","")); // TODO: Success message
      } else {
        return res.status(500).send(createResponse("","")); // TODO: Error message
      }
    });
  };

  // Check for existing answers and save new answers
  mongoConnection.getDB().collection("poll_answers").find(insert).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("",err)); // TODO: Error message
    }
    if (result.length === 0) {
      // User/anonymous has not answered any questions in this poll yet, create a default set
      mongoConnection.getDB().collection("poll_answers").insertOne(insert, function (err2, result2) {
        if (err2) {
          return res.status(500).send(createResponse("",err2)); // TODO: Error message
        }
        if (result2.result.ok !== 1) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
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
      return res.status(500).send(createResponse("",err)); // TODO: Error message
    }
  });
  return res.status(200).send(createResponse("","")); // TODO: Success message;
});
router.post("/:id/delete", function (req, res) {//use router.delete??
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").deleteOne({"_id": id}, function (err, res) {
    if (err) {
      return res.status(500).send(createResponse("",err)); // TODO: Error message;
    }
  });
  return res.status(200).send(createResponse("","")); // TODO: Success message;
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
      return res.status(500).send(createResponse("",err)); // TODO: Error message;
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
    res.send(createResponse({"Questions": openQuestions, "PollID": id}));
  });
});

router.get("/:id/results", function (req, res, next) {
  const id = validateID("polls", id);
  if (!id) {
    return res.status(400).send(createResponse(null, "Invalid ID."));
  }

  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("",err)); // TODO: Error message;
    }

    mongoConnection.getDB().collection("poll_answers").find({"PollID": id}).toArray(function (err2, result2) {
      if (err2) {
        return res.status(500).send(createResponse("",err2)); // TODO: Error message;
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
      res.send(createResponse({"Results": results}));
    });
  });
});

//Given a userID and a pollID, this function returns true if the user has permission to access the poll, and false otherwise
//if the poll is linked to a group (there is information in the .Group data), the group is checked for user access permissions
//if the poll is not linked, it returns true by default
function checkUserPermission(userID, pollID) { //TODO add checks to make sure IDs are valid
  var groupID = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id":0, "Groups":1})[0].Group; //get groupID attached to poll
  if (groupID.length !== 0 && groupID !== undefined) { //groupID returned something
    var users = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Users":1})[0].Users; //get list of users in group
    for (var user in users) {
      if (user === userID) {
        return true;
      }
    }
    return false;
  }
  return true; //returns true if the poll isn't linked to a group
}
//Given an adminID (really just a userID) and a pollID, this function returns true if the user has admin permissions for the poll, and false otherwise
//if the poll is linked to a group (there is information in the .Group data), the group is checked for admin access
//if the poll is not linked, it checks the internal .Admin data and returns true see if it finds the adminID, and false otherwise
function checkAdminPermission(adminID, pollID) { //TODO add checks to make sure IDs are valid
  var groupID = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id":0, "Groups":1})[0].Group; //get groupID attached to the poll
  if (groupID.length === 0 || groupID.length === undefined) { //groupID returned something
    var admins = mongoConnection.getDB().collection("polls").find({"_id": pollID}, {"_id":0, "Admins":1})[0].Admins; //get list of admins in attached group
    for (var admin in admins) { 
      if (admin === adminID) { //check for adminID in list
        return true;
      }
    }
  } else { //groupID didn't return something
    admins = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Admins":1})[0].Admins; //get internal list of Admins
    for (admin in admins) {
      if (admin === adminID) { //check for adminID in list
        return true;
      }
    }
  }
  
  return false; //adminID wasn't found
}

module.exports = router;
