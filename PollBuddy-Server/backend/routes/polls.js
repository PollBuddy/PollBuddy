var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");

router.post("/new", function (req, res) {
  // Get POST data
  var jsonContent = req.body;

  // Validate
  // Name should be present
  if(!jsonContent.Name) {
    return res.status(400).send("Error, Name parameter not specified");
  }

  // TODO: Need to add more validation like length, characters perhaps, etc.

  // Add to DB
  mongoConnection.getDB().collection("polls").insertOne({Name: jsonContent.Name}, function(err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      if(result.result.ok !== 1) {
        // Failed to insert for some reason
        return res.sendStatus(500);
      } else {
        // Things seemed to be ok, send result message and ID of inserted object
        return res.send({ "Result": "Success", "ID": result.insertedId });
      }
    }
  });

});
router.post("/:id/edit", function (req, res) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  var jsonContent = req.body;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Questions !== undefined) {//QUESTION IS AN OBJECT https://docs.google.com/document/d/1kFdjwiE4_POgcTDqXK-bcnz4RAeLG6yaF2RxLzkNDrE/edit
      mongoConnection.getDB().collection("polls").updateOne({ "_id": id }, { "$addToSet": { Questions: jsonContent.Questions } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        }
      });
    } else {
      return res.sendStatus(400);
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Questions !== undefined) {
      mongoConnection.getDB().collection("polls").updateOne({ "_id": id }, { "$pull": { Questions: "" } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        }
      });
    } else {
      return res.sendStatus(400);
    }
  } else {
    return res.sendStatus(400);
  }
  return res.sendStatus(200); // TODO: Ensure this is true
});
router.post("/:id/submit", function (req, res) {
  const jsonContent = req.body;
  const pollId = new mongoConnection.getMongo().ObjectID(req.params.id);
  let data = {}; // Stores data being submitted to DB
  let insert = {}; // Stores insertion location

  // Check that pollId was specified and is valid
  if (pollId !== undefined) {
    mongoConnection.getDB().collection("polls").find({ "_id": pollId }).toArray(function (err, result) {
      if (err) {
        return res.sendStatus(500);
      }
      if(result.length === 0) {
        return res.status(500).send({"Result": "Error", "Error": "Cannot find poll"});
      }
    });
  }

  // Check that answers were supplied in the correct format
  if(!jsonContent.Answers) {
    return res.status(500).send({"Result": "Error", "Error": "Answers not specified"});
  }
  if(!Array.isArray(jsonContent.Answers)) {
    return res.status(500).send({"Result": "Error", "Error": "Answers is not an array"});
  }
  if(jsonContent.Answers.empty) {
    return res.status(500).send({"Result": "Error", "Error": "Answers is empty"});
  }

  // Add timestamp to answers
  data.Answers = jsonContent.Answers;
  data.Timestamp = Date.now();

  // Check if the user is logged in or anonymous
  if(req.session.UserID) {
    // User is logged in, save with their ID
    insert["$and"] = [{ "PollID": pollId }, { "UserID": jsonContent.UserID }];
  } else {
    insert["PollID"] = pollId;
  }

  // Save answers function for reducing code reuse
  let save = function() {
    mongoConnection.getDB().collection("poll_answers").updateOne(insert, {"$push": {"Answers": data}}, function (err3, result3) {
      if (err3) {
        return res.sendStatus(500);
      }
      if(result3.result.ok === 1) {
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
      mongoConnection.getDB().collection("poll_answers").insertOne(insert, function(err2, result2) {
        if (err2) {
          return res.sendStatus(500);
        }
        if(result2.result.ok !== 1) {
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
  mongoConnection.getDB().collection("poll_answers").deleteOne({ "_id": id }, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  return res.sendStatus(200);
});
router.post("/:id/delete", function (req, res) {//use router.delete??
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").deleteOne({ "_id": id }, function (err, res) {
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
  mongoConnection.getDB().collection("polls").find({ "_id": id }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  });
});

router.get("/:id/view", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").find({ "_id": id }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    
    // TODO: Make sure ID is valid

    // Loop through the poll's questions and add to openQuestions the Question Number, Text and Answer Choices if
    // the question is set as Visible.
    let openQuestions = [];
    for(let i = 0; i < result[0].Questions.length; i++) {
      if(result[0].Questions[i][0].Visible) {
        let q = {};
        q.QuestionNumber = result[0].Questions[i][0].QuestionNumber;
        q.QuestionText = result[0].Questions[i][0].QuestionText;
        q.AnswerChoices = result[0].Questions[i][0].AnswerChoices;
        openQuestions.push(q);
      }
    }
    // Send the open questions
    res.send({ "Questions": openQuestions });
  });
});

module.exports = router;
