const createError = require("http-errors");
const express = require("express");
const router = express.Router();
const mongoConnection = require("../modules/mongoConnection.js");
const { createResponse } = require("../modules/utils.js");

router.post("/new", function (req, res) {
  const jsonContent = req.body;
  if (jsonContent.Name == null || jsonContent.Name === "") {
    return res.status(400).send(createResponse("","")); // TODO: Error message
  }
  mongoConnection.getDB().collection("groups").insertOne({ Name: jsonContent.Name }, function (err, res) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
  });
  return res.status(200).send(createResponse("","")); // TODO: Success message
});
router.post("/:id/edit", function (req, res) {
  const id = new mongoConnection.getMongo().ObjectID(req.params.id);
  const jsonContent = req.body;
  let success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.Name !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$set": { Name: jsonContent.Name } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$addToSet": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.status(400).send(createResponse("","")); // TODO: Error message
    }
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.Instructors !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Instructors: jsonContent.Instructors } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Polls !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Polls: jsonContent.Polls } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Users !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Users: jsonContent.Users } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Admins !== undefined) {
      mongoConnection.getDB().collection("groups").updateOne({ "_id": id }, { "$pull": { Admins: jsonContent.Admins } }, function (err, res) {
        if (err) {
          return res.status(500).send(createResponse("","")); // TODO: Error message
        } else {
          success = true;
        }
      });
    }
    if (success === false) {
      return res.status(400).send(createResponse("","")); // TODO: Error message
    }
  } else {
    return res.status(400).send(createResponse("","")); // TODO: Error message
  }
  return res.status(200).send(createResponse("","")); // TODO: Success message
});
router.post("/:id/delete", function (req, res) {//use router.delete??
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").deleteOne({ "_id": id }, function (err, res) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
  });
  res.status(200).send(createResponse("","")); // TODO: Success message
});
router.get("/", function (req, res, next) {
  mongoConnection.getDB().collection("groups").find({}, { projection: { _id: 1 } }).map(function (item) {
    return item._id;
  }).toArray(function (err, result) {
    res.send(createResponse(result));
  });
});
router.get("/:id", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
    return res.send(createResponse(result));
  });
});
router.get("/:id/polls", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }, { projection: { _id: 0, Polls: 1 } }).map(function (item) {
    return res.send(createResponse(item.Polls));
  }).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
    return res.send(createResponse(result[0]));
  });
});
router.get("/:id/users", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }, { projection: { _id: 0, Users: 1 } }).map(function (item) {
    return item.Users;
  }).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
    return res.send(createResponse(result[0]));
  });
});
router.get("/:id/admins", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("groups").find({ "_id": id }, { projection: { _id: 0, Admins: 1 } }).map(function (item) {
    return item.Admins;
  }).toArray(function (err, result) {
    if (err) {
      return res.status(500).send(createResponse("","")); // TODO: Error message
    }
    return res.send(createResponse(result[0]));
  });
});

router.get("/id:/join", function (req, res, next) {
  return res.status(404).send(createResponse("","")); // TODO: Error message
});

/**
 * Adds user to group with given id
 */
router.post("/id:/join", function (res, req, next) {
  var userID = req.session["UserID"];
  if (userID === undefined) {
    res.status(401).send(createResponse(null, "Not logged in" ));
  }
  
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  // Add user to group, do nothing if they are already in it
  mongoConnection.getDB().collection("groups").updateOne({ "_id:": id }, { $addToSet: { Users: userID } }, (err, res) => {
    if (err) {
      return res.status(500).send(createResponse(null, err));
    }
    // Returns 1 if it was added, 0 if it already existed
    return res.status(200).send(createResponse(res.result.nModified));
  });
});

//given a userID and a groupID, this function checks to see if the userID has access to the group
//first it finds the list of .Users data for the given groupID, then checks to see if the given userID is in that list 
function checkUserPermission(userID, groupID) { //TODO add checks to make sure IDs are valid
  var users = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Users":1})[0].Users; //get list of users
  for (var user in users) {
    if (user === userID) { //check for existence
      return true; //true if userID is found
    }
  }
  return false; //false if userID is not found
}

//given a adminID (really just a userID) and a groupID, this function checks to see if the adminID has admin access to the group
//first it finds the list of .Admins data for the given groupID, then checks to see if the given adminID is in that list
function checkAdminPermission(adminID, groupID) { //TODO add checks to make sure IDs are valid
  var admins = mongoConnection.getDB().collection("groups").find({"_id": groupID}, {"_id":0, "Admins":1})[0].Admins; //get list of admins
  for (var admin in admins) {
    if (admin === adminID) { //check for existence
      return true; //true if adminID is found
    }
  }
  return false; //false if adminID is not found
}

module.exports = router;
