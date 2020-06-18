var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var mongoConnection = require("../modules/mongoConnection.js");

router.post("/new/", function (req, res) {
  var jsonContent = req.body;
  mongoConnection.getDB().collection("polls").insertOne({Name: jsonContent.Name});
  return res.sendStatus(200); // TODO: Ensure this is true
});
router.post("/:id/edit/", function (req, res) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  var jsonContent = req.body;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Questions !== undefined) {//QUESTION IS AN OBJECT https://docs.google.com/document/d/1kFdjwiE4_POgcTDqXK-bcnz4RAeLG6yaF2RxLzkNDrE/edit
      mongoConnection.getDB().collection("polls").updateOne({"_id": id}, {"$addToSet": {Questions: jsonContent.Questions}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        }
      });
    } else {
      return res.sendStatus(400);
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Questions !== undefined) {
      mongoConnection.getDB().collection("polls").updateOne({"_id": id}, {"$pull": {Questions: ""}}, function (err, res) {
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
router.post("/:id/submit/", function (req, res) {//todo
  var jsonContent = req.body;
  var pollId = new mongoConnection.getMongo().ObjectID(req.params.id);
  var count = 0;
  if (pollId != undefined && jsonContent.UserID != undefined) {
    mongoConnection.getDB().collection("poll_answers").find({"$and": [{"PollID": pollId}, {"UserID": jsonContent.UserID}]}).toArray(function (err, result) {
      if (err) {
        count = 0;
      }
      count = result.length;
    });
    if (count == 0) {
      mongoConnection.getDB().collection("poll_answers").insertOne({"PollID": pollId}, {"UserID": jsonContent.UserID}, {"$addToSet": jsonContent.Answers});
    } else {
      if (jsonContent.Answers != undefined) {
        mongoConnection.getDB().collection("poll_answers").updateOne({"$and": [{"PollID": pollId}, {"UserID": jsonContent.UserID}]}, {"$addToSet": jsonContent.Answers}, function (err, result) {
          if (err) {
            res.sendStatus(500);
          }
        });
      } else {
        return res.sendStatus(400);
      }
    }
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
});
router.get("/pollAnswers/", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("poll_answers").deleteOne({"_id": id}, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  return res.sendStatus(200);
});
router.post("/:id/delete/", function (req, res) {//use router.delete??
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
router.get("/:id/", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("polls").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  });
});

module.exports = router;
