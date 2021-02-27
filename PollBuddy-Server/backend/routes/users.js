var createError = require("http-errors");
var express = require("express");
var router = express.Router();
const bson = require("bson");
var bcrypt = require("bcrypt");
var path = require("path");

var mongoConnection = require("../modules/mongoConnection.js");
const rpi = require("../modules/rpi");

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
    mongoConnection.getDB().collection("users").findOne({ Email: email }, {
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
                req.session["UserName"] = result_db["_id"];
                req.session["userData"] = {
                  loggedIn: true, 
                  username: result_db["UserName"],
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

router.get("/login/rpi", rpi.bounce, function (req, res, next) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user is logged in with CAS successfully.

  // Some options used in the resultant data returned
  var options = {
    root: path.join(__dirname, "../public"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  // Log the user in on the backend side of things

  console.log(req.session);

  if (req.session.cas_user) {
    console.log("Locating user to add to session."); // TODO: Remove after testing
    mongoConnection.getDB().collection("users").findOne({ UserName: req.session.cas_user }, { projection: { _id: false, UserName: true } }, (err, result) => {
      if (err) {
        // Something went wrong
        // Send the user the login process error page
        console.log("Database Error Occurred"); // TODO: Improve error messaging
        console.log(err);
        res.status(500).sendFile("pages/loginRedirect_Error.html", options, function (err2) {
          if (err2) {
            console.log(err2);
            res.send(500);
          }
        });
      } else {
        console.log("Result found"); // TODO: Remove after testing
        console.log(result);
        if (result === null) {
          // User not registered

          // Delete session information obtained from CAS
          delete req.session.cas_return_to;
          delete req.session.cas_user;

          // Send the user the unregistered user error page
          res.status(401).sendFile("pages/loginRedirect_Unregistered.html", options, function (err2) {
            if (err2) {
              console.log(err2);
              res.send(500);
            }
          });
        } else {
          // Success!
          // TODO: Ensure that is really what we want (we probs want to check for the existence of our result)

          // Save some information in the session
          req.session.UserData = {};
          req.session.UserData.UserName = result.UserName;

          // Send the user the login success page
          res.sendFile("pages/loginRedirect.html", options, function (err2) {
            if (err2) {
              console.log(err2);
              res.send(500);
            }
          });
        }
      }
    });

  } else {
    // Something went wrong
    // Send the user the login process error page
    console.log("Error occurred, user got to the rpi login page without logging in"); // TODO: Improve error messaging
    res.status(500).sendFile("pages/loginRedirect_Error.html", options, function (err2) {
      if (err2) {
        console.log(err2);
        res.send(500);
      }
    });
  }

});

function isEmpty(obj) {
  for(var prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj,prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

router.post("/register", function (req, res) {
  var requestBody = req.body;

  const firstnameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(requestBody.FirstName);
  const lastnameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(requestBody.LastName);
  const userValid = new RegExp(/^[a-zA-Z0-9_.-]{3,32}$/).test(requestBody.UserName);
  const emailValid = new RegExp(/^[a-zA-Z0-9_.]+@\w+\.\w+$/).test(requestBody.Email);
  const passValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
    .test(requestBody.Password);

  let errorMsg = {};

  if(!firstnameValid){
    errorMsg["firstName"] = "Invalid firstname format!";
  }else if(!lastnameValid){
    errorMsg["lastName"] = "Invalid lastname format!";
  }else if(!userValid){
    errorMsg["userName"] = "Invalid username format!";
  }else if(!emailValid){
    errorMsg["email"] = "Invalid email format!";
  }else if(!passValid){
    errorMsg["password"] = "Invalid password format!";
  }

  if (isEmpty(errorMsg)) {
    mongoConnection.getDB().collection("users").insertOne({
      FirstName: requestBody.FirstName,
      LastName: requestBody.LastName,
      UserName: requestBody.UserName,
      Email: requestBody.Email,
      Password: bcrypt.hashSync(requestBody.Password, 10)
    }, (err, result) => {
      if (err) {
        return res.send("Exists");
      } else {
        return res.sendStatus(203);
      }
    });
  }else {
    return res.send(errorMsg);
  }
});

router.get("/register/rpi", rpi.bounce2, function (req, res, next) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user has logged in with CAS successfully.

  // At this point, we just want to copy over the CAS data into our session format, and indicate what we want
  // the client to fill out in the frontend. Then that'll get send to /api/users/register/rpi (POST)
  // which will validate and finalize the registration process.

  // Some options used in the resultant data returned
  var options = {
    root: path.join(__dirname, "../public"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  if (req.session.cas_user) {

    // Configure email, username (For RPI, that is the CAS username + "@rpi.edu") and save in session
    req.session.userData = {};
    req.session.userData.userName = req.session.cas_user.toLowerCase();
    req.session.userData.email = req.session.userData.userName + "@rpi.edu";

    // Delete session information obtained from CAS
    delete req.session.cas_return_to;
    delete req.session.cas_user;

    // Send the user to the registration step 2 page
    return res.redirect("/register/school/step2?userName=" + req.session.userData.userName + "&email=" + req.session.userData.email);

  } else {
    // Something went wrong
    // Send the user the registration process error page
    console.log("Error occurred, user got to the rpi registration page without logging in"); // TODO: Improve error messaging
    res.status(500).sendFile("pages/registerRedirect_Error.html", options, function (err2) {
      if (err2) {
        console.log(err2);
        res.send(500);
      }
    });
  }

});

router.post("/register/rpi", function (req, res) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user has logged in with CAS successfully.

  // At this point, the user should be submitting extra data to complete registration. We want to validate it
  // and complete the registration, or send an error back.

  var requestBody = req.body;

  const firstNameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(requestBody.firstName);
  const lastNameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(requestBody.lastName);

  let errorMsg = {};

  if(!firstNameValid){
    errorMsg["firstName"] = "Invalid First Name!";
  }
  if(!lastNameValid){
    errorMsg["lastName"] = "Invalid Last Name!";
  }

  // Configure email, username (For RPI, that is the CAS username + "@rpi.edu"), overwriting whatever the user
  // may have sent as we don't want it anyways.
  requestBody.userName = req.session.userData.userName;
  requestBody.email = req.session.userData.email;

  // Some options used in the resultant data returned
  var options = {
    root: path.join(__dirname, "../public"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  if (isEmpty(errorMsg)) {
    mongoConnection.getDB().collection("users").insertOne({
      FirstName: requestBody.firstName,
      FirstNameLocked: false,
      LastName: requestBody.lastName,
      LatNameLocked: false,
      UserName: requestBody.userName,
      UserNameLocked: true,
      Email: requestBody.email,
      EmailLocked: true,
      SchoolAffiliation: "RPI"
    }, (err, result) => {
      if (err) {
        // Something went wrong
        console.log("Database Error occurred while creating a new user with RPI");
        console.log(err);
        if(err.code === 11000) { // This code means we're trying to insert a duplicate key (aka user already registered)
          res.status(400).json({"result": "failure", "error": "This username is already in use"});
        } else {
          res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
      } else {
        // No error object at least
        if (result.result.ok === 1) {
          // One result changed, therefore it worked. Send the response object with some basic info for the frontend to store
          res.json({"result": "success", "data": {"firstName": requestBody.firstName,
            "lastName": requestBody.lastName, "userName": requestBody.userName}});
        } else {
          // For some reason, the user wasn't inserted, send an error.
          console.log("Database Error occurred while creating a new user with RPI");
          console.log(err);
          res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
        console.log(result);
        // TODO: Validate the result object

      }
    });
  } else {
    return res.json({ "result": "failure", "error": "Validation failed", "data": errorMsg });
  }

});

// stored user session data
router.get("/session", function (req, res, next) {
  res.send(req.session.userData || {});
});

router.post("/:id/edit", function (req, res) {//TODO RCS BOOL refer to documentation
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  var jsonContent = req.body;
  var success = false;
  if (jsonContent.Action === "Add") {
    if (jsonContent.FirstName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$addToSet": { FirstName: jsonContent.FirstName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.LastName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$addToSet": { LastName: jsonContent.LastName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.UserName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$addToSet": { UserName: jsonContent.UserName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Email !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$addToSet": { Email: jsonContent.Email } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Password !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$addToSet": { Password: bcrypt.hashSync(jsonContent.Password, 10) } }, function (err, res) {
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
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$pull": { FirstName: jsonContent.FirstName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.LastName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$pull": { LastName: jsonContent.LastName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.UserName !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$pull": { UserName: jsonContent.UserName } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Email !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$pull": { Email: jsonContent.Email } }, function (err, res) {
        if (err) {
          return res.sendStatus(500);
        } else {
          success = true;
        }
      });
    }
    if (jsonContent.Password !== undefined) {
      mongoConnection.getDB().collection("users").updateOne({ "_id": id }, { "$pull": { Password: jsonContent.Password } }, function (err, res) {
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

router.get("/:id", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("users").find({ "_id": id }).toArray(function (err, result) {
    if (err) {
      return res.sendStatus(500);
    }
    return res.send(result);
  });
});

router.get("/:id/groups", function (req, res, next) {
  var id = new mongoConnection.getMongo().ObjectID(req.params.id);
  mongoConnection.getDB().collection("users").find({ "_id": id }, { projection: { _id: 0, Groups: 1 } }).map(function (item) {
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
    return req.session["UserName"] !== undefined;
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
      mongoConnection.getDB().collection("users").findOne({ _id: bson.ObjectId(req.session["UserName"]) }, { projection: { Password: false } }, (err, result) => {
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
