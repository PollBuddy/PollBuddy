var createError = require("http-errors");
var express = require("express");
var router = express.Router();
const bson = require("bson");
var bcrypt = require("bcrypt");
var path = require("path");
const Joi = require("joi");

var mongoConnection = require("../modules/mongoConnection.js");
const rpi = require("../modules/rpi");
const {createResponse, validateID, isEmpty} = require("../modules/utils"); // object destructuring, only import desired functions

/**
 * This route is not used. It is simply there to have some response to /api/users/
 * @urlparams {void} None
 * @returns {void} status 200: {result: success, data: "User Routes"}
 * @name backend/users/_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
// eslint-disable-next-line no-unused-vars
router.get("/", function (req, res) {
  return res.send(createResponse("Users routes"));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/
 * @urlparams {void} None
 * @returns {void} status 200: {result: success, data: "User Routes"}
 * @name backend/users/_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
// eslint-disable-next-line no-unused-vars
router.post("/", function (req, res) {
  return res.send(createResponse("Users routes"));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/login when using GET.
 * @urlparams {void} None
 * @returns {void} status 501: {result: "failure", error: "GET is not available for this route. Use POST."}
 * @name backend/users/login_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
// eslint-disable-next-line no-unused-vars
router.post("/login", function (req, res) {
  return res.status(501).send(createResponse(null, "GET is not available for this route. Use POST."));
});

/**
 * This route is called by frontend internal JS as part of the login with Poll Buddy process. It validates the login
 * information, then sets up some session details and sends the frontend the relevant data.
 * @urlparams {void} None
 * @postdata {void} userNameEmail: string, password: string
 * @returns {void} On success: status 200, {result: success, data: {firstName: "user's first name", lastName: "user's
 *                                          last name"}, userName: "user's username" }
 * On failure: status 401, {result: failure, data: "Invalid credentials."}
 *         or: status 406, {result: failure, data: "This account is associated with a school."}
 *         or: status 500, {result: failure, data: "An error occurred while validating login details."}
 *         or: status 500, {result: failure, data: "An error occurred while communicating with the database."
 * @name backend/users/login_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/login", function (req, res) {

  // This is used to figure out if the entered userNameEmail value is a username or an email address, plus make
  // sure that a username and a password were even supplied and worth trying to validate. This is probably a
  // micro-optimization to not even bother checking some passwords to save some DB calls, but why not?
  // Please note: This schema is up to date with the wiki as of 2021/03/14, but is NOT a comprehensive test.
  const schema = Joi.object({
    userName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9-._]+$/)).min(3).max(32).required(),
    email: Joi.string().email({minDomainSegments: 2}).max(320).required(),
    password: Joi.string().min(10).max(256).required()
  });
  const validResult = schema.validate({userName: req.body.userNameEmail, email: req.body.userNameEmail,
    password: req.body.password}, {abortEarly: false});

  // Check the results out
  let userNameValid = true;
  let emailValid = true;
  let passwordValid = true;
  if (validResult.error) {
    for(let i = 0; i < validResult.error.details.length; i++) {
      if(validResult.error.details[i].context.key === "userName") {
        userNameValid = false;
      } else if(validResult.error.details[i].context.key === "email") {
        emailValid = false;
      } else if(validResult.error.details[i].context.key === "password") {
        passwordValid = false;
      }
    }
  } else {
    console.log("Error: No validation errors when checking details in /login. This should not happen.");
    return res.status(500).send(createResponse(null, "An error occurred while validating login details."));
  }

  // Check whether to validate email or username
  let mode = "";
  if(userNameValid && !emailValid) {
    mode = "userName";
  } else if(!userNameValid && emailValid) {
    mode = "email";
  } else {
    return res.status(401).send(createResponse(null, "Invalid credentials"));
  }

  // Make sure the password is worth checking (performance optimization as hashing is slow)
  if(!passwordValid) {
    return res.status(401).send(createResponse(null, "Invalid credentials"));
  }

  // Define an internal function to use for validating the data returned from the DB query
  let validate = function(err, result) {
    if (err) {
      // Something went wrong
      console.log("Database Error occurred while locating a user to log in with Poll Buddy");
      console.error(err);
      return res.status(500).send(createResponse(null, "An error occurred while communicating with the database."));

    } else if (result === null) {
      // No user was found
      return res.status(401).send(createResponse(null, "Invalid credentials."));

    } else {
      // A user was found!

      // Make sure this isn't a school account as they can't log in here
      if(result.SchoolAffiliation) {
        return res.status(406).send(createResponse(null, "This account is associated with a school."));

      } else {
        // Not a school account, check the password
        bcrypt.compare(req.body.password, result.Password, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            // Something went wrong with bcrypt
            console.error(bcryptErr);
            return res.status(500).send(createResponse(null, "An error occurred while validating credentials."));

          } else if (bcryptResult) {
            // Password validated and matches

            // Configure user data and save in session
            req.session.userData = {};
            req.session.userData.userName = result.UserName;
            req.session.userData.email = result.Email;

            // Send the user the necessary data to complete the login process
            return res.send(createResponse({"firstName": result.FirstName, "lastName": result.LastName, "userName": result.UserName}));

          } else {
            // Password validated and does not match
            return res.status(401).send(createResponse(null, "Invalid credentials"));
          }
        });
      }
    }
  };

  // Finally, use that function to check the database for a match
  if(mode === "userName") {
    mongoConnection.getDB().collection("users").findOne({ UserName: req.body.userNameEmail }, {
      _id: true, FirstName: true, LastName: true, UserName: true, Password: true}, validate);

  } else if(mode === "email") {
    mongoConnection.getDB().collection("users").findOne({ Email: req.body.userNameEmail }, {
      _id: true, FirstName: true, LastName: true, UserName: true, Password: true}, validate);

  } else {
    return res.status(401).send(createResponse(null, "Invalid credentials"));
  }

});

/**
 * This route is hit by the user's browser as part of the login with RPI process. It bounces the user to the CAS login
 * portal, then that returns here and we set up some session details and send the frontend the relevant data.
 * @urlparams {void} None
 * @returns {void} On success: a browser redirect to /login/school/step2 with GET parameters resembling our typical
 * error messages. Possible return values include:
 * ?result=success&data={"firstName": <First Name>, "lastName": <Last Name>, "userName": <Username>}
 * On failure: a browser redirect to /login/school/step2 with GET parameters resembling our typical error messages.
 * Possible return values include:
 * ?result=failure&error=An error occurred while communicating with the database.
 * ?result=failure&error=User is not registered.
 * ?result=failure&error=User has not logged in with RPI.
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
    mongoConnection.getDB().collection("users").findOne({ UserName: req.session.cas_user }, {
      projection: { _id: false, UserName: true, Email: true, FirstName: true, LastName: true } }, (err, result) => {
      if (err) {
        // Something went wrong
        console.log("Database Error occurred while searching for an existing user during log in with RPI.");
        console.log(err);
        // Send the user the login with school step 2 page with relevant information
        return res.redirect("/login/school/step2?result=failure&error=An error occurred while communicating with the database.");

      } else {
        // Something did not go wrong (yet).

        // Delete session information obtained from CAS
        delete req.session.cas_return_to;
        delete req.session.cas_user;

        if (result === null) {
          // User not registered

          // Send the user the login with school step 2 page with relevant information
          return res.redirect("/login/school/step2?result=failure&error=User is not registered.");

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
    console.log("Error occurred, user got to the rpi login page without logging in. This should not happen.");
    return res.redirect("/login/school/step2?result=failure&error=User has not logged in with RPI.");
  }

});

/**
 * This route called by frontend internal JS as part of the registration with Poll Buddy process. Here, we set up some
 * session details, validate data we were sent, save it in the database if success, and send errors if there's any problems.
 * @urlparams {void} body: { firstName: string, lastName: string, userName: string, email: string, password: string }
 * @returns {void} On success: status 200, {"result": "success", "data": {"firstName": req.body.firstName,
                               "lastName": req.body.lastName, "userName": req.body.userName}}
 * On failure: status 400, { "result": "failure", "error": "This username is already in use" }
 *         or: status 400 { "result": "failure", "error": "Validation failed", "data": (errorMsg obj with keys of firstName,
 *                           lastName, etc. as relevant and with value of error message) });
 *         or: status 500, { "result": "failure", "error": "An error occurred while communicating with the database" }
 * @name backend/users/register_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/register", function (req, res) {

  const firstnameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(req.body.firstName);
  const lastnameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(req.body.lastName);
  const userNameValid = new RegExp(/^[a-zA-Z0-9_.-]{3,32}$/).test(req.body.userName);
  const emailValid = new RegExp(/^[a-zA-Z0-9_.]+@\w+\.\w+$/).test(req.body.email);
  const passwordValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
    .test(req.body.password);

  let errorMsg = {};

  if(!firstnameValid){
    errorMsg["firstName"] = "Invalid firstname format!";
  } else if(!lastnameValid){
    errorMsg["lastName"] = "Invalid lastname format!";
  } else if(!userNameValid){
    errorMsg["userName"] = "Invalid username format!";
  } else if(!emailValid){
    errorMsg["email"] = "Invalid email format!";
  } else if(!passwordValid){
    errorMsg["password"] = "Invalid password format!";
  }

  if (isEmpty(errorMsg)) {
    // No validation errors, let's try adding the user!

    // Configure user data and save in session
    req.session.userData = {};
    req.session.userData.userName = req.body.userName;
    req.session.userData.email = req.body.email;

    // Attempt to insert the user into the database
    mongoConnection.getDB().collection("users").insertOne({
      FirstName: req.body.firstName,
      FirstNameLocked: false,
      LastName: req.body.lastName,
      LatNameLocked: false,
      UserName: req.body.userName,
      UserNameLocked: true,
      Email: req.body.email,
      EmailLocked: false,
      Password: bcrypt.hashSync(req.body.password, 10)
    }, (err, result) => {
      if (err) {
        // Something went wrong
        if(err.code === 11000) {
          // This code means we're trying to insert a duplicate key (aka user already registered)
          if(err.keyPattern.Email) {
            return res.status(400).json({"result": "failure", "error": "This email is already in use."});

          } else if(err.keyPattern.UserName) {
            return res.status(400).json({"result": "failure", "error": "This username is already in use."});

          } else {
            console.log("Database Error occurred while creating a new user.");
            console.log(err);
            return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database."});
          }

        } else {
          console.log("Database Error occurred while creating a new user.");
          console.log(err);
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database."});
        }

      } else {
        // No error object at least
        if (result.result.ok === 1) {
          // One result changed, therefore it worked. Send the response object with some basic info for the frontend to store
          return res.json({"result": "success", "data": {"firstName": req.body.firstName,
            "lastName": req.body.lastName, "userName": req.body.userName}});

        } else {
          // For some reason, the user wasn't inserted, send an error.
          console.log("Database Error occurred while creating a new user.");
          console.log(err);
          return res.status(500).json({"result": "failure", "error": "An error occurred while communicating with the database."});
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
router.get("/register/rpi", rpi.bounce, function (req, res) {

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
 * @returns {void} On success: status 200, {"result": "success", "data": {"firstName": req.body.firstName,
                               "lastName": req.body.lastName, "userName": req.body.userName}}
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

  

  const firstNameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(req.body.firstName);
  const lastNameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(req.body.lastName);

  let errorMsg = {};

  if(!firstNameValid){
    errorMsg["firstName"] = "Invalid First Name!";
  }
  if(!lastNameValid){
    errorMsg["lastName"] = "Invalid Last Name!";
  }

  // Configure email, username (For RPI, that is the CAS username + "@rpi.edu"), overwriting whatever the user
  // may have sent as we don't want it anyways.
  req.body.userName = req.session.userData.userName;
  req.body.email = req.session.userData.email;

  if (isEmpty(errorMsg)) {
    // No validation errors, let's try adding the user!
    mongoConnection.getDB().collection("users").insertOne({
      FirstName: req.body.firstName,
      FirstNameLocked: false,
      LastName: req.body.lastName,
      LatNameLocked: false,
      UserName: req.body.userName,
      UserNameLocked: true,
      Email: req.body.email,
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
          return res.json({"result": "success", "data": {"firstName": req.body.firstName,
            "lastName": req.body.lastName, "userName": req.body.userName}});
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
