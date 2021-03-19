const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");

router.post("/new", function (req, res) {
  const jsonContent = req.body;
  if (jsonContent.Name == null || jsonContent.Name === "") {
    return res.sendStatus(400);
  }
  mongoConnection.getDB().collection("groups").insertOne({ Name: jsonContent.Name }, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  return res.sendStatus(200);
});
router.post("/:id/edit", function (req, res) {
  const id = new mongoConnection.getMongo().ObjectID(req.params.id);
  const jsonContent = req.body;
  let success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Name !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$set": { Name: jsonContent.Name } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.sendStatus(400);
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.sendStatus(400);
    }
  } else {
    return res.sendStatus(400);
  }
  return res.sendStatus(200);
});
router.post("/:id/delete", function (req, res) {//use router.delete??
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").deleteOne({ "_id": id }, function (err, res) {
    if (err) {
      return res.sendStatus(500);
    }
  });
  res.sendStatus(200);
});
router.get("/", function (req, res, next) {
  mongoConnection.getDB().collection("groups").find({}, { projection: { _id: 1 } }).map(function (item) {
    return item._id;
  }).toArray(function (err, result) {
    res.send(result);
  });
});
router.get("/:id", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result);
  });
});
router.get("/:id/polls", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }, { projection: { _id: 0, Polls: 1 } }).map(function (item) {
    return res.send(item.Polls);
  }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result[0]);
  });
});
router.get("/:id/users", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }, { projection: { _id: 0, Users: 1 } }).map(function (item) {
    return item.Users;
  }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result[0]);
  });
});

router.get("/id:/join", function (req, res, next) {
  return res.sendStatus(404);
});

/**
 * Adds user to group with given id
 */
router.post("/id:/join", function (res, req, next) {
  var userID = req.session["UserID"];
  if (userID === undefined) {
    res.status(401).send({ error: "Not logged in" });
  }
  
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  // Add user to group, do nothing if they are already in it
  mongoConnection.getDB().collection("groups").updateOne({ "_id:": id }, { $addToSet: { Users: userID } }, (err, res) => {
    if (err) {
      return res.status(500).send(err);
    }
    // Returns 1 if it was added, 0 if it already existed
    return res.status(200).send(res.result.nModified);
  });
});

function checkAccessPermission(userID, groupID) {
  var cursor = mongoConnection.getDB().collection('groups').find({"_id": groupID}, {"_id":0, "Users":1})
  for (i in cursor) {
    if (i == userID) {
      return true;
    }
  }
  return false;
}

module.exports = router;
