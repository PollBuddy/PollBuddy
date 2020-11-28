var createError = require("http-errors");
var express = require("express");
var router = express.Router();
const bson = require("bson");
var bcrypt = require("bcrypt");
var path = require("path");

var mongoConnection = require("../modules/mongoConnection.js");
const cas = require('../modules/cas');

// GET users listing.
router.get("/", function (req, res, next) {
  mongoConnection.getDB().collection("users").find({}).toArray(function (err, result) {
    res.send(result);
  });
});
router.post("/login", function (req, res) {

  // Get email and password from request in JSON form
  var email = req.body["email"];
  var password = req.body["password"];

  // Check if email is present
  if (email === undefined) {
    res.status(400).send({
      error: "Missing email"
    });
  } else if (password === undefined) { // Check if password is present
    res.status(400).send({
      error: "Missing password"
    });
  } else {
    mongoConnection.getDB().collection("users").findOne({Email: email}, {
      _id: true,
      Password: true
    }, (err_db, result_db) => {
      if (err_db) {
        console.error(err_db);
        res.status(500).send({
          error: "Database error"
        });
      } else if (result_db === null) {
        res.status(401).send({
          error: "Invalid credentials"
        });
      } else {
        bcrypt.compare(password, result_db["Password"], (err_compare, result_compare) => {
          if (err_compare) {
            console.error(err_compare);
            res.status(500).send({
              error: "Hash comparison error"
            });
          } else if (result_compare) {
            req.session.regenerate((err_regen) => {
              if (err_regen) {
                console.error(err_regen);
                res.status(500).send({
                  error: "Error regenerating session"
                });
              } else {
                // successful login
                req.session["UserID"] = result_db["_id"];
                req.session["userData"] = {
                  loggedIn: true, 
                  username: result_db["Username"], 
                  firstName: result_db["FirstName"], 
                  lastName: result_db["LastName"],
                  sessionID: req.session.id
                };
                res.sendStatus(200);
              }
            });
          } else {
            res.status(401).send({
              error: "Invalid credentials"
            });
          }
        });
      }
    });
  }

});

router.get("/login/cas", cas.bounce2, function (req, res, next) {

  // This runs if the user is logged in successfully

  // Log the user in on the backend side of things
  if(req.query.ticket) {
    console.log("Locating user to add to session."); // TODO: Remove after testing
    mongoConnection.getDB().collection("users").findOne({Username: req.session.cookie.cas_user}, {projection: {_id: false, Username: true}}, (err, result) => {
      if (err) {
        console.log("Error occurred"); // TODO: Improve error messaging
        console.log(err);
      } else {
        console.log("Result found"); // TODO: Remove after testing
        console.log(result);
        if(result == null) {
          // User not registered, TODO: Redirect to registration
          return res.send("User not registered!");
        } else {
          req.session.UserID = result.Username;
        }
      }
    });

  } else {
    console.log("Ticket not specified."); // TODO: Remove after testing
  }

  // Redirect the user to the homepage with a nice message
  var options = {
    root: path.join(__dirname, '../public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile("pages/loginRedirect.html", options, function (err) {
    if (err) {
      console.log(err);
      res.send(500);
    }
  });

});


router.post("/register", function (req, res, next) {
  var requestBody = req.body;

  mongoConnection.getDB().collection("users").insertOne({
    FirstName: requestBody.FirstName,
    LastName: requestBody.LastName,
    Username: requestBody.Username,
    Email: requestBody.Email,
    Password: bcrypt.hashSync(requestBody.Password, 10)
  }, (err, result) => {
    if (err) {
      return res.send("Exists");
    } else {
      return res.sendStatus(200);
    }
  });
});

router.post("/:id/edit/", function (req, res) {//TODO RCS BOOL refer to documentation
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  var jsonContent = req.body;
  var success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.FirstName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$addToSet": {FirstName: jsonContent.FirstName}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.LastName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$addToSet": {LastName: jsonContent.LastName}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Username !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$addToSet": {Username: jsonContent.Username}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Email !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$addToSet": {Email: jsonContent.Email}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Password !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$addToSet": {Password: bcrypt.hashSync(jsonContent.Password, 10)}}, function (err, res) {
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
    if (jsonContent.FirstName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$pull": {FirstName: jsonContent.FirstName}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.LastName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$pull": {LastName: jsonContent.LastName}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Username !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$pull": {Username: jsonContent.Username}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Email !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$pull": {Email: jsonContent.Email}}, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Password !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({"_id": id}, {"$pull": {Password: jsonContent.Password}}, function (err, res) {
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
  return res.sendStatus(200); // TODO: Ensure this is true
});

router.get("/:id/", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("users").find({"_id": id}).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result);
  });
});

router.get("/:id/groups", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("users").find({"_id": id}, {projection: {_id: 0, Groups: 1}}).map(function (item) {
    return res.send(item.Groups);
  }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result[0]);
  });
});

module.exports = router;

// Middleware for getting user information
module.exports.user_middleware = function (req, res, next) {

  req.isLoggedIn = function () {
    return req.session["UserID"] !== undefined;
  };

  // If the current user is logged in, a user object will be returned, otherwise a 401 will be sent
  // Callback takes two parameters: err and user
  req.getCurrentUser = function (callback) {
    if (!req.isLoggedIn()) {
      res.status(401).send({
        error: "Not logged in"
      });
      if (typeof callback === "function") {
        callback(new Error("Not logged in"));
      }
    } else {
      mongoConnection.getDB().collection("users").findOne({_id: bson.ObjectId(req.session["UserID"])}, {projection: {Password: false}}, (err, result) => {
        if (err) {
          return callback(err);
        } else {
          if (typeof callback === "function") {
            callback(null, result);
          }
        }
      });
    }
  };

  next();
};
