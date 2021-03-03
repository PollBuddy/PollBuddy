var createError = require("http-errors");
var express = require("express");
var router = express.Router();
const bson = require("bson");
var bcrypt = require("bcrypt");
var path = require("path");

var mongoConnection = require("../modules/mongoConnection.js");
const rpi = require("../modules/rpi");

// TODO: This probably should move somewhere else, like a utils.js that I think was created in another branch.
function isEmpty(obj) {
  for(var prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj,prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

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

/**
 * This route is hit by the user's browser as part of the login with RPI process. It bounces the user to the CAS login
 * portal, then that returns here and we set up some session details and send the frontend the relevant data.
 * @urlparams {void} None
 * @returns {void} On success: a browser redirect to /login/school/step2 with GET parameters of TODO: FILL IN
 * On failure: TODO: FILL IN
 * @name backend/users/login/rpi_GET
 * @param {string} path - Express path
 * @param {middleware} middleware - Express middleware to redirect the user to CAS
 * @param {callback} callback - function handler for data received after CAS redirection
 */
router.get("/login/rpi", rpi.bounce, function (req, res, next) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user is logged in with CAS successfully.

  // Make sure they succeeded in authenticating with CAS
  if (req.session.cas_user) {

    // Lowercase the cas_user data first
    // eslint-disable-next-line camelcase
    req.session.cas_user = req.session.cas_user.toLowerCase();

    // Check to make sure they're already registered
    console.log(req.session.cas_user);
    mongoConnection.getDB().collection("users").findOne({ UserName: req.session.cas_user }, {
      projection: { _id: false, UserName: true, Email: true, FirstName: true, LastName: true } }, (err, result) => {
      if (err) {
        // Something went wrong
        console.log("Database Error occurred while searching for an existing user during log in with RPI");
        console.log(err);
        // Note: It's not impossible that this won't format correctly and will need some %20's, not sure. TODO: Test.
        // Send the user the login with school step 2 page with relevant information
        return res.redirect("/login/school/step2?result=failure&error=An error occurred while communicating with the database");
      } else {
        // No error object at least
        console.log(result);
        if (result === null) {
          // User not registered

          // Delete session information obtained from CAS
          delete req.session.cas_return_to;
          delete req.session.cas_user;

          // Send the user the login with school step 2 page with relevant information
          return res.redirect("/login/school/step2?result=failure&error=User is not registered");
        } else {
          // User has been found

          // Configure user data and save in session
          req.session.userData = {};
          req.session.userData.userName = result.UserName;
          req.session.userData.email = result.Email;

          // Send the user the login with school step 2 page with relevant information
          return res.redirect("/login/school/step2?result=success&data=" + JSON.stringify(
            {"firstName": result.FirstName, "lastName": result.LastName, "userName": result.UserName}
          ));
        }
      }
    });

  } else {
    // Something went wrong
    console.log("Error occurred, user got to the rpi registration page without logging in. This should not happen.");
    return res.redirect("/login/school/step2?result=failure&error=User has not logged in with RPI");
  }

});

/**
 * This route called by frontend internal JS as part of the registration with Poll Buddy process. Here, we set up some
 * session details, validate data we were sent, save it in the database if success, and send errors if there's any problems.
 * @urlparams {void} body: { firstName: string, lastName: string, userName: string, email: string, password: string }
 * @returns {void} On success: status 200, {"result": "success", "data": {"firstName": requestBody.firstName,
                               "lastName": requestBody.lastName, "userName": requestBody.userName}}
 * On failure: status 400, { "result": "failure", "error": "This username is already in use" }
 *         or: status 400 { "result": "failure", "error": "Validation failed", "data": (errorMsg obj with keys of firstName,
 *                           lastName, etc. as relevant and with value of error message) });
 *         or: status 500, { "result": "failure", "error": "An error occurred while communicating with the database" }
 * @name backend/users/register_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/register", function (req, res) {
  var requestBody = req.body;

  const firstnameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(requestBody.firstName);
  const lastnameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(requestBody.lastName);
  const userValid = new RegExp(/^[a-zA-Z0-9_.-]{3,32}$/).test(requestBody.userName);
  const emailValid = new RegExp(/^[a-zA-Z0-9_.]+@\w+\.\w+$/).test(requestBody.email);
  const passValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
    .test(requestBody.password);

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
    // No validation errors, let's try adding the user!

    // Configure user data and save in session
    req.session.userData = {};
    req.session.userData.userName = requestBody.userName;
    req.session.userData.email = requestBody.email;

    // Attempt to insert the user into the database
    mongoConnection.getDB().collection("users").insertOne({
      FirstName: requestBody.firstName,
      FirstNameLocked: false,
      LastName: requestBody.lastName,
      LatNameLocked: false,
      UserName: requestBody.userName,
      UserNameLocked: true,
      Email: requestBody.email,
      EmailLocked: false
    }, (err, result) => {
      if (err) {
        // Something went wrong
        console.log("Database Error occurred while creating a new user");
        console.log(err);
        if(err.code === 11000) { // This code means we're trying to insert a duplicate key (aka user already registered)
          return res.status(400).json({"result": "failure", "error": "This username is already in use"});
        } else {
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
      } else {
        // No error object at least
        if (result.result.ok === 1) {
          // One result changed, therefore it worked. Send the response object with some basic info for the frontend to store
          return res.json({"result": "success", "data": {"firstName": requestBody.firstName,
            "lastName": requestBody.lastName, "userName": requestBody.userName}});
        } else {
          // For some reason, the user wasn't inserted, send an error.
          console.log("Database Error occurred while creating a new user");
          console.log(err);
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
      }
    });
  } else {
    return res.status(400).json({ "result": "failure", "error": "Validation failed", "data": errorMsg });
  }
});

/**
 * This route is hit by the user's browser as part of the registration with RPI process. It bounces the user to the CAS login
 * portal, then that returns here and we set up some session details, then bounce them back to /register/school/step2
 * with some additional data requests to finalize the registration process.
 * @urlparams {void} None
 * @returns {void} On success: a browser redirect to /register/school/step2 with GET parameters of userName, email, and school.
 * On failure: { "result": "failure", "error": "User has not logged in with RPI" }
 * @name backend/users/register/rpi_GET
 * @param {string} path - Express path
 * @param {middleware} middleware - Express middleware to redirect the user to CAS
 * @param {callback} callback - function handler for data received after CAS redirection
 */
router.get("/register/rpi", rpi.bounce2, function (req, res) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user has logged in with CAS successfully.

  // At this point, we just want to copy over the CAS data into our session format, and indicate what we want
  // the client to fill out in the frontend. Then that'll get send to /api/users/register/rpi (POST)
  // which will validate and finalize the registration process.

  // Check to make sure the user completed the CAS registration process
  if (req.session.cas_user) {

    // Configure email, username (For RPI, that is the CAS username + "@rpi.edu") and save in session
    req.session.userData = {};
    req.session.userData.userName = req.session.cas_user.toLowerCase();
    req.session.userData.email = req.session.userData.userName + "@rpi.edu";

    // Delete session information obtained from CAS
    delete req.session.cas_return_to;
    delete req.session.cas_user;

    // Send the user to the registration step 2 page
    return res.redirect("/register/school/step2?userName=" + req.session.userData.userName +
      "&email=" + req.session.userData.email + "&school=rpi");

  } else {
    // Something went wrong
    console.log("Error occurred, user got to the rpi registration page without logging in. This should not happen.");
    return res.status(401).json({"result": "failure", "error": "User has not logged in with RPI"});
  }

});

/**
 * This route is called by frontend internal JS as part of the register with RPI process. At this point, the user is at
 * /register/school/step2 in the frontend, and are submitting registration data here for processing. We validate it and
 * save it in the database if success, and send errors if there's any problems.
 * @urlparams {void} body: {firstName: string, lastName: string, userName: string (optional, ignored), email: string (optional, ignored)}
 * @returns {void} On success: status 200, {"result": "success", "data": {"firstName": requestBody.firstName,
                               "lastName": requestBody.lastName, "userName": requestBody.userName}}
 * On failure: status 400, { "result": "failure", "error": "This username is already in use" }
 *         or: status 400 { "result": "failure", "error": "Validation failed", "data": (errorMsg obj with keys of firstName,
 *                           lastName, etc. as relevant and with value of error message) });
 *         or: status 500, { "result": "failure", "error": "An error occurred while communicating with the database" }
 * @name backend/users/register/rpi_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
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

  if (isEmpty(errorMsg)) {
    // No validation errors, let's try adding the user!
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
          return res.status(400).json({"result": "failure", "error": "This username is already in use"});
        } else {
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
      } else {
        // No error object at least
        if (result.result.ok === 1) {
          // One result changed, therefore it worked. Send the response object with some basic info for the frontend to store
          return res.json({"result": "success", "data": {"firstName": requestBody.firstName,
            "lastName": requestBody.lastName, "userName": requestBody.userName}});
        } else {
          // For some reason, the user wasn't inserted, send an error.
          console.log("Database Error occurred while creating a new user with RPI");
          console.log(err);
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database"});
        }
      }
    });
  } else {
    return res.status(400).json({ "result": "failure", "error": "Validation failed", "data": errorMsg });
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
