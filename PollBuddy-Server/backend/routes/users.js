const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");
const rpi = require("../modules/rpi");

const { createResponse, validateID, isEmpty, getResultErrors, createModel, isLoggedIn, debugRoute} = require("../modules/utils"); // object destructuring, only import desired functions
const { userLoginValidator, userInformationValidator, userRegisterValidator,  userSchema, getUser, getUserGroups, createUser, editUser, userParamsValidator } = require("../models/User.js");
const {paramValidator} = require("../modules/validatorUtils");

const {send} = require("../modules/email.js");

// This file handles /api/users URLs

/**
 * This route is not used. It is simply there to have some response to /api/users/
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "success", "data": "User Routes" }
 * @name backend/users/_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/", function (req, res) {
  debugRoute(req,res);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "success", "data": "User Routes" }
 * @name backend/users/_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/", function (req, res) {
  debugRoute(req,res);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/login when using GET.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "GET is not available for this route. Use POST." }
 * @name backend/users/login_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/login", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route is called by frontend internal JS as part of the login with Poll Buddy process. It validates the login
 * information, then sets up some session details and sends the frontend the relevant data.
 * @getdata {void} None
 * @postdata {void} userNameEmail: string, password: string
 * @returns {void} On success: Status 200: { "result": "success", "data": { "firstName": "<First Name>",
 *                                                            "lastName": "<Last Name>", "userName": "<Username>" }
 * On failure: Status 401: { "result": "failure", "error": "Invalid credentials." }
 *         or: Status 406: { "result": "failure", "error": "This account is associated with a school." }
 *         or: Status 500: { "result": "failure", "error": "An error occurred while validating login details." }
 *         or: Status 500: { "result": "failure", "error": "An error occurred while communicating with the database." }
 * @name backend/users/login_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/login", function (req, res) {

  // This is used to figure out if the entered userNameEmail value is a username or an email address, plus make
  // sure that a username and a password were even supplied and worth trying to validate. This is probably a
  // micro-optimization to not even bother checking some passwords to save some DB calls, but why not?
  // Please note: This schema is up to date with the wiki as of 2021/03/14, but is NOT a comprehensive test.
  const validResult = userLoginValidator.validate({
    userName: req.body.userNameEmail,
    email: req.body.userNameEmail,
    password: req.body.password
  }, { abortEarly: false });

  // Check the results out
  let errors = getResultErrors(validResult);
  if (isEmpty(errors)) {
    console.log("Error: No validation errors when checking details in /login. This should not happen.");
    return sendResponse(res, httpCodes.InternalServerError("An error occurred while validating login details."));
  }
  // Check whether to validate email or username
  let mode = "";
  if (!errors["userName"] && errors["email"]) {
    mode = "userName";
  } else if (errors["userName"] && !errors["email"]) {
    mode = "email";
  } else {
    return sendResponse(res, httpCodes.Unauthorized("Invalid credentials."));
  }

  // Define an internal function to use for validating the data returned from the DB query
  let validate = function (err, result) {
    if (err) {
      // Something went wrong
      console.log("Database Error occurred while locating a user to log in with Poll Buddy");
      console.error(err);
      return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
    } else if (result === null) {
      // No user was found
      return sendResponse(res, httpCodes.Unauthorized("Invalid credentials."));
    } else {
      // A user was found!

      // Make sure this isn't a school account as they can't log in here
      if (result.SchoolAffiliation) {
        // This is a school account, don't bother trying to log in anymore.
        return sendResponse(res, httpCodes.NotAcceptable("This account is associated with a school."));
      } else {
        // Not a school account

        // Make sure the password is worth checking (performance optimization as hashing is slow)
        if (errors["password"]) {
          return sendResponse(res, httpCodes.Unauthorized("Invalid credentials."));
        } else {
          // Check the password
          bcrypt.compare(req.body.password, result.Password, function (bcryptErr, bcryptResult) {
            if (bcryptErr) {
              // Something went wrong with bcrypt
              console.error(bcryptErr);
              return sendResponse(res, httpCodes.InternalServerError("An error occurred while validating credentials."));
            } else if (bcryptResult) {

              req.session.userData = {};
              req.session.userData.userID = result._id;

              // Send the user the necessary data to complete the login process
              return sendResponse(res, httpCodes.Ok({
                "firstName": result.FirstName,
                "lastName": result.LastName,
                "userName": result.UserName
              }));
            } else {
              // Password validated and does not match
              return sendResponse(res, httpCodes.Unauthorized("Invalid credentials."));
            }
          });
        }
      }
    }
  };

  // Finally, use that function to check the database for a match
  if (mode === "userName") {
    mongoConnection.getDB().collection("users").findOne({ UserName: req.body.userNameEmail }, {
      _id: true, FirstName: true, LastName: true, UserName: true, Password: true, SchoolAffiliation: true, collation: { locale: "en_US", strength: 2 }
    }, validate);

  } else if (mode === "email") {
    mongoConnection.getDB().collection("users").findOne({ Email: req.body.userNameEmail }, {
      _id: true, FirstName: true, LastName: true, UserName: true, Password: true, SchoolAffiliation: true, collation: { locale: "en_US", strength: 2 }
    }, validate);

  } else {
    // Didn't pass validation for username or email. This shouldn't ever run anyways though.
    return sendResponse(res, httpCodes.Unauthorized("Invalid credentials."));
  }

});

/**
 * This route is hit by the user's browser as part of the login with RPI process. It bounces the user to the CAS login
 * portal, then that returns here and we set up some session details and send the frontend the relevant data.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: a browser redirect to /login/school/step2 with GET parameters resembling our typical
 * backend returned data format messages. See format below.
 * ?result=success&data={"firstName": "<First Name>", "lastName": "<Last Name>", "userName": "<Username>"}
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
router.get("/login/rpi", rpi.bounce, function (req, res) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user is logged in with CAS successfully.

  // Make sure they succeeded in authenticating with CAS
  if (req.session.cas_user) {

    // Check to make sure they're already registered
    mongoConnection.getDB().collection("users").findOne({ UserName: "__rpi_" + req.session.cas_user.toLowerCase() }, {
      projection: { _id: true, UserName: true, FirstName: true, LastName: true }
    }, (err, result) => {
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
          req.session.userData.userID = result._id;

          // Send the user the login with school step 2 page with relevant information
          return res.redirect("/login/school/step2?result=success&data=" + JSON.stringify(
            { "firstName": result.FirstName, "lastName": result.LastName, "userName": result.UserName }
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
 * This route is not used. It is simply there to have some response to /api/users/login/rpi when using POST.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "POST is not available for this route. Use GET." }
 * @name backend/users/login/rpi_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/login/rpi", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/register when using GET.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "GET is not available for this route. Use POST." }
 * @name backend/users/register_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/register", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route called by frontend internal JS as part of the registration with Poll Buddy process. Here, we set up some
 * session details, validate data we were sent, save it in the database if success, and send errors if there's any problems.
 * @getdata {void} None
 * @postdata {void} firstName: string, lastName: string, userName: string, email: string, password: string
 * @returns {void} On success: Status 200: { "result": "success", "data": { "firstName": "<First Name>",
 *                                           "lastName": "<Last Name>", "userName": "<Username>" } }
 * On failure: Status 400: { "result": "failure", "error": "This username is already in use." }
 *         or: Status 400: { "result": "failure", "error": "This email is already in use." }
 *         or: Status 400: { "result": "failure", "error": "Validation failed.", "data": (errorMsg obj with keys of firstName,
 *                           lastName, etc. as relevant and with value of error message) }
 *         or: Status 500: { "result": "failure", "error": "An error occurred while communicating with the database." }
 * @name backend/users/register_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/register", function (req, res) {
  const validResult = userRegisterValidator.validate({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  if (validResult.value.userName.startsWith("__")) {
    errors["userName"] = true;
  }

  let errorMsg = {};
  if (errors["userName"]) {
    errorMsg["userName"] = "Invalid username format!";
  }
  if (errors["email"]) {
    errorMsg["email"] = "Invalid email format!";
  }
  if (errors["password"]) {
    errorMsg["password"] = "Invalid password format!";
  }
  if (errors["firstName"]) {
    errorMsg["firstName"] = "Invalid firstname format!";
  }
  if (errors["lastName"]) {
    errorMsg["lastName"] = "Invalid lastname format!";
  }

  if (isEmpty(errorMsg)) {
    // No validation errors, let's try adding the user!

    // Attempt to insert the user into the database
    bcrypt.hash(req.body.password, 10, function (error, hash) {

      //Something went wrong with bcrypt hash function
      if (error) {
        console.log("Error occurred while hashing a password with bcrypt.");
        console.log(error);
        return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
      }

      let user = createModel(userSchema, {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        UserName: req.body.userName.toLowerCase(),
        Email: req.body.email.toLowerCase(),
        Password: hash,
      });

      mongoConnection.getDB().collection("users").insertOne(user, (err, result) => {
        //console.log(err)
        if (err) {
          // Something went wrong
          if (err.code === 11000) {
            // This code means we're trying to insert a duplicate key (aka user already registered somehow)
            if (err.keyPattern.Email) {
              // Email in use
              return sendResponse(res, httpCodes.BadRequest("This email is already in use."));
            } else if (err.keyPattern.UserName) {
              // Username in use
              return sendResponse(res, httpCodes.BadRequest("This username is already in use."));
            } else {
              // An unknown error occurred
              console.log("Database Error occurred while creating a new user with Poll Buddy.");
              console.log(err);
              return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
            }

          } else {
            // An unknown error occurred
            console.log("Database Error occurred while creating a new user with Poll Buddy.");
            console.log(err);
            return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
          }
        } else {

          // One result changed, therefore it worked.
          // Configure user data and save in session
          req.session.userData = {};
          req.session.userData.userID = result.insertedId;

          // Send the response object with some basic info for the frontend to store
          return sendResponse(res, httpCodes.Ok({
            "firstName": user.FirstName,
            "lastName": user.LastName,
            "userName": user.UserName
          }));
        }
      });
    });

  } else {
    return sendResponse(res, httpCodes.BadRequest("Validation failed."));
  }

});

/**
 * This route is hit by the user's browser as part of the registration with RPI process. It bounces the user to the CAS login
 * portal, then that returns here and we set up some session details, then bounce them to /register/school/step2
 * with some additional data requests to finalize the registration process.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: a browser redirect to /register/school/step2 with GET parameters of:
 *                                                   ?result=success&userName=<username>&email=<email>&school=rpi
 * On failure: a browser redirect to /register/school/step2 with GET parameters of:
 *                                                   ?result=failure&error=User has not logged in with RPI.
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

    // Temporarily store some data
    // Username is __rpi_<username from CAS>
    // Email is <username from CAS>@rpi.edu
    req.session.userDataTemp = {};
    req.session.userDataTemp.userName = "__rpi_" + req.session.cas_user.toLowerCase();
    req.session.userDataTemp.email = req.session.cas_user.toLowerCase() + "@rpi.edu";

    // Delete session information obtained from CAS
    delete req.session.cas_return_to;
    delete req.session.cas_user;

    // Send the user to the registration step 2 page with relevant info to prefill
    return res.redirect("/register/school/step2?result=success&data=" + JSON.stringify({ "userName":
      req.session.userDataTemp.userName, "email": req.session.userDataTemp.email, "school": "rpi"}));

  } else {
    // Something went wrong
    console.log("Error occurred, user got to the rpi registration page without logging in. This should not happen.");
    // Send the user to the registration step 2 page with error info
    return res.redirect("/register/school/step2?result=failure&error=User has not logged in with RPI.");
  }

});

/**
 * This route is called by frontend internal JS as part of the register with RPI process. At this point, the user is at
 * /register/school/step2 in the frontend, and are now submitting registration data here for processing. We validate
 * and save it in the database if success, and send errors if there's any problems.
 * @getdata {void} None
 * @postdata {void} firstName: string, lastName: string, userName: string (optional, ignored), email: string (optional, ignored)
 * @returns {void} On success: Status 200: { "result": "success", "data": {"firstName": "<First Name>",
 *                                                              "lastName": "<Last Name>", "userName": "<Username>" } }
 * On failure: Status 400: { "result": "failure", "error": "This username is already in use." }
 *         or: Status 400: { "result": "failure", "error": "This email is already in use." }
 *         or: Status 400: { "result": "failure", "error": "Validation failed.", "data": (errorMsg obj with keys of firstName,
 *                           lastName, etc. as relevant and with value of error message) }
 *         or: Status 500: { "result": "failure", "error": "An error occurred while communicating with the database." }
 *         or: Status 500: { "result": "failure", "error": "Prerequisite data is not available." }
 * @name backend/users/register/rpi_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/register/rpi", function (req, res) {

  // The user is first bounced to the RPI CAS login and only after will they end up in here.
  // Therefore, this only runs if the user has logged in with CAS successfully.

  // At this point, the user should be submitting extra data to complete registration. We want to validate it
  // and complete the registration, or send an error back.

  const validResult = userInformationValidator.validate({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }, { abortEarly: false });

  let errors = getResultErrors(validResult);
  let errorMsg = {};

  if (errors["firstName"]) {
    errorMsg["firstName"] = "Invalid First Name!";
  }
  if (errors["lastName"]) {
    errorMsg["lastName"] = "Invalid Last Name!";
  }

  // Make sure we've got data from step 1
  if (!req.session.userDataTemp) {
    return sendResponse(res, httpCodes.InternalServerError("Prerequisite data is not available."));
  }
  // Configure email, username, overwriting whatever the user may have sent as we don't want it anyways.
  req.body.userName = req.session.userDataTemp.userName;
  req.body.email = req.session.userDataTemp.email;

  if (isEmpty(errors)) {
    // No validation errors, let's try adding the user!
    let user = createModel(userSchema, {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      UserName: req.body.userName,
      Email: req.body.email,
      SchoolAffiliation: "RPI",
      EmailLocked: true,
    });

    mongoConnection.getDB().collection("users").insertOne(user, (err, result) => {
      if (err) {
        // Something went wrong
        if (err.code === 11000) {
          // This code means we're trying to insert a duplicate key (aka user already registered somehow)
          if (err.keyPattern.Email) {
            // Email in use
            return sendResponse(res, httpCodes.BadRequest("This email is already in use."));
          } else if (err.keyPattern.UserName) {
            // Username in use
            return sendResponse(res, httpCodes.BadRequest("This username is already in use."));
          } else {
            // An unknown error occurred
            console.log("Database Error occurred while creating a new user with RPI.");
            console.log(err);
            return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
          }
        } else {
          // An unknown error occurred
          console.log("Database Error occurred while creating a new with RPI.");
          console.log(err);
          return sendResponse(res, httpCodes.InternalServerError("An error occurred while communicating with the database."));
        }

      } else {

        // One result changed, therefore it worked.

        // Delete temporary user information
        delete req.session.userDataTemp;

        // Configure email, username by copying from the result object and saving in the session
        req.session.userData = {};
        req.session.userData.userID = result.insertedId;

        // Send the response object with some basic info for the frontend to store
        return sendResponse(res, httpCodes.Ok({
          "firstName": user.FirstName,
          "lastName": user.LastName,
          "userName": user.UserName
        }));
      }
    });
  } else {
    return sendResponse(res, httpCodes.BadRequest("Validation failed."));
  }
});

/**
 * This route is not used. It is simply there to have some response to /api/users/logout when using GET.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "GET is not available for this route. Use POST." }
 * @name backend/users/register_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/logout", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route is called by frontend internal JS as part of the logout process. It essentially just deletes the session's
 * userData fields. The frontend should then clear out its own cache of those values, but this is not essential for
 * the security of the logout process, it would just give a weird and bad user experience.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 200: { "result": "success", "data": "User was logged out successfully." }
 * @name backend/users/logout_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/logout", function (req, res) {
  // Delete the userData in the session
  delete req.session.userData;
  return sendResponse(res, httpCodes.Ok("User was logged out successfully."));
});

/**
 * This route is used to retrieve user information.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: Status 200
 * On failure: Status 400: { "result": "failure", "error": "Error: Invalid User, Session ID does not match any user."}
 * @name backend/users/me_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/me", isLoggedIn, async function (req, res) {
  let response = await getUser(req.session.userData.userID);
  return sendResponse(res, response);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/me when using POST.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "POST is not available for this route. Use GET."}
 * @name backend/users/me_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/me", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/me/edit when using GET.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "GET is not available for this route. Use POST."}
 * @name backend/users/me/edit_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/me/edit", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route is used to modify user information
 * @getdata {void} None
 * @postdata {void} Action: string, FirstName: string, LastName: string, UserName: string, Email: string, Password: string
 * @returns {void} On success: Status 200
 * On failure: Status 400: { "result": "failure", "error": "Invalid Action | Add Field | Remove Field" }
 *             Status 500: { "result": "failure", "error": "Error updating database information"}
 * @name backend/users/me/edit_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.post("/me/edit", isLoggedIn, async function (req, res) {
  let response = await editUser(req.session.userData.userID, req.body);
  return sendResponse(res, response);
});

/**
 * This route is used to retrieve all the groups this user is a part of
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: Status 200
 * On failure: Status 500: { "result": "failure", "error": "Error: Unable to retrieve groups from database" }
 * @name backend/users/me/groups_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/me/groups", isLoggedIn, async function (req, res) {
  let response = await getUserGroups(req.session.userData.userID);
  return sendResponse(res, response);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/me/groups when using POST.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "POST is not available for this route. Use GET." }
 * @name backend/users/me/groups_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/me/groups", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/forgotpassword/ when using GET
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405 { "result": "failure", "error": "GET is not available for this routee."}
 * @name backend/users/forgotpassword_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/forgotpassword/",function (req,res) {
  return sendResponse(res,httpCodes.MethodNotAllowed("GET is not available for this route."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/forgotpassword/ when using POST
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405 { "result": "failure", "error": "POST is not available for this route."}
 * @name backend/users/forgotpassword_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.post("/forgotpassword/",function (req,res) {
  return sendResponse(res,httpCodes.MethodNotAllowed("POST is not available for this route."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/forgotpassword/submit when using GET
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405 { "result": "failure", "error": "GET is not available for this route. Use POST."}
 * @name backend/users/forgotpassword/submit_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/forgotpassword/submit",function (req,res) {
  return sendResponse(res,httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * The route primes a given user's data so their password may be reset
 * accepts either the users username or email
 * sets in the user's data a random 32char code and an expiration date 1 hour from the requests handling
 * @getdata {void} None
 * @postdata {void} email : String , username : String
 * @returns {void} on success : Status 200
 * On failure : Status 500 { "result": "failure", "error": "neither username nor email provided"}
 *              Status 500 { "result": "failure", "error": "could not update user"}
 *              Status 500 { "result": "failure", "error": "could not find user"}
 * @name backend/users/forgotpassword/submit_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.post("/forgotpassword/submit/",function (req,res) {
  let email = req.body.email;
  const username = req.body.username;

  let document;

  if(email){
    email = email.toLowerCase();
    document = mongoConnection.getDB().collection("users").findOne({"Email":email});
  }else if(username){
    document = mongoConnection.getDB().collection("users").findOne({"UserName":username});
  }else{
    return sendResponse(res,httpCodes.InternalServerError("Neither username nor email provided."));
  }

  document
    .then(
      result => {
        if(result) {
          const alphabet = "ABCDEFGHKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz23456789";
          let key = "";
          for(let i = 0; i < 32 ; i++) {
            key += alphabet[Math.floor(Math.random() * alphabet.length)];
          }

          let expireTime = new Date();
          expireTime.setHours(expireTime.getHours()+1);

          mongoConnection.getDB().collection("users").updateOne({"_id": result._id},{ "$set": { "ResetPasswordToken" : key, "ResetPasswordTokenExpiration" : expireTime } },function (err, response) {
            if (err) {
              return sendResponse(res,httpCodes.InternalServerError("Could not update user data."));
            } else{
              let emailBody = 
              "Hello, " + result.UserName + "\n"
              +"\n You are receiving this email because a password reset request was sent to this account."
              +"\n\n If you requested a password reset, follow the link below:"
              +"\n  " + process.env.FRONTEND_URL + "/login/reset"
              +"\n Your password reset token is: " + key
              +"\n\n If you did not make a password reset request, you can safely ignore this message.\n\n";
              
              send(result.Email,"Poll Buddy Password Reset",emailBody,function (success,messages) {
                if (success){
                  return sendResponse(res,httpCodes.Ok());
                }else{
                  return sendResponse(res,httpCodes.InternalServerError("Could not send email."));
                }
              });
            }
          });
        }else{
          return sendResponse(res,httpCodes.InternalServerError("Could not find user."));
        }
      },
      err => {return sendResponse(res,httpCodes.InternalServerError("Could not find user."));}
    );
});

/**
 * This route is not used. It is simply there to have some response to /api/users/forgotpassword/validate when using GET
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405 { "result": "failure", "error": "GET is not available for this route. Use POST."}
 * @name backend/users/forgotpassword_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/forgotpassword/validate",function (req,res) {
  return sendResponse(res,httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * Checks if the user specified by username has a resetPasswordToken matching that given, and it has not yet expired
 * This is the predicate determining if a user can reset their password at the given moment
 * @getdata {void} None
 * @postdata {void} resetPasswordToken : String , username : String
 * @returns {void} on success : Status 200 
 * On failure : Status 500 { "result": "failure", "error": "Token is invalid (token expired)"}
 *              Status 500 { "result": "failure", "error": "Token is invalid (user with token not found)"}
 * @name backend/users/forgotpassword_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.post("/forgotpassword/validate",function (req,res) {
  const token = req.body.resetPasswordToken;
  const username = req.body.username;
  mongoConnection.getDB().collection("users").findOne({"UserName":username,"ResetPasswordToken":token}, function(error,result) {
    if(result){
      let currentDate = new Date();
      if( currentDate < result.ResetPasswordTokenExpiration ){
        return sendResponse(res,httpCodes.Ok());
      } else {
        return sendResponse(res,httpCodes.InternalServerError("Token is invalid (token expired)."));
      }
    } else {
      return sendResponse(res,httpCodes.InternalServerError("Token is invalid (user with token not found)."));
    }
  });
});

/**
 * This route is not used. It is simply there to have some response to /api/users/forgotpassword/change when using GET
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405 { "result": "failure", "error": "GET is not available for this route. Use POST."}
 * @name backend/users/forgotpassword_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/forgotpassword/change",function (req,res) {
  return sendResponse(res.httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route resets the password of the user with the given username to the given password
 * This is only done if the user has a valid token as per the validation route and if the password satisfies the strength requirements
 * @getdata {void} None
 * @postdata {void} resetPasswordToken : String , username : String , password : String
 * @returns {void} On success : Status 200
 * On failure : Status 500 { "result": "failure", "error": "could not hash password"}
 *              Status 500 { "result": "failure", "error": "could not update password"}
 *              Status 500 { "result": "failure", "error": "token expired"}
 *              Status 500 { "result": "failure", "error": "user with token not found"}
 *              Status 500 { "result": "failure", "error": "invalid password"}
 * @name backend/users/forgotpassword_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.post("/forgotpassword/change",function (req,res) {
  let token = req.body.resetPasswordToken;
  let username = req.body.username;
  let newPassword = req.body.password;

  let newPasswordValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
    .test(newPassword);

  if(newPasswordValid){
    mongoConnection.getDB().collection("users").findOne({"UserName":username,"ResetPasswordToken":token},function (searchError,searchResult){
      if(searchResult){
        let expiration = searchResult.ResetPasswordTokenExpiration;
        let currentDate = new Date();
        if(currentDate < expiration){
          bcrypt.hash(newPassword, 10, function (hashError,hash) {
            if(hashError){
              return sendResponse(res,httpCodes.InternalServerError("Could not hash password."));
            }else{
              mongoConnection.getDB().collection("users").updateOne({"_id":searchResult._id},{"$set":{"Password":hash},"$unset":{"ResetPasswordTokenExpiration":"","ResetPasswordToken":""}},function(updateError,updateResult){
                if(updateError){
                  return sendResponse(res,httpCodes.InternalServerError("Could not update password."));
                }else{
                  return sendResponse(res,httpCodes.Ok());
                }
              });
            }
          }); 
          
        }else{
          return sendResponse(res,httpCodes.InternalServerError("Token expired."));
        }
      }else{
        return sendResponse(res,httpCodes.InternalServerError("User with token not found."));
      }
    });
  }else{
    return sendResponse(res,httpCodes.InternalServerError("Invalid password."));
  }
});

/**
 * Note: This is a debug route,
 * which will be only available when running in development mode soon.
 * Full documentation: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-Backend-Routes-(Users)#apiusersid
 * ---
 * This route is used to get the full user information stored in the database
 * full user information: { Username, eMail, Password, FirstName, LastName }
 * ^^^ Refer to: https://github.com/PollBuddy/PollBuddy/wiki/Specifications-%E2%80%90-User-Data
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: Status 200: *Username,eMail,Password,FirstName,LastName* in an Array
 * On failure: Status 500 // TODO: Error message
 * @name backend/users/:id
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/:id", paramValidator(userParamsValidator), async function (req, res) {
  let response = await getUser(req.params.id);
  return sendResponse(res, response);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/:id when using POST.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "POST is not available for this route. Use GET." }
 * @name backend/users/:id_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

/**
 * This route is not used. It is simply there to have some response to /api/users/:id/edit when using GET.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "GET is not available for this route. Use POST." }
 * @name backend/users/:id/edit_GET
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.get("/:id/edit", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("GET is not available for this route. Use POST."));
});

/**
 * This route is used to modify user information
 * @getdata {void} None
 * @postdata {void} Action: string, FirstName: string, LastName: string, UserName: string, Email: string, Password: string
 * @returns {void} On success: Status 200
 * On failure: Status 400 // TODO: Endpoint requires reworking and these will be filled in then
 *         or: Status 500 // TODO: Endpoint requires reworking and these will be filled in then
 *         or: Status 200: { "result": "success" }
 * @name backend/users/:id/edit_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for data received
 */
router.post("/:id/edit", paramValidator(userParamsValidator), async function (req, res) {
  let response = await editUser(req.params.id, req.body);
  return sendResponse(res, response);
});

/**
 * This route obtains the group of users by id, and returns a network response depending on whether
 * the network communication was successful or not
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} On success: Status 200
 * On failure: Status 500 // TODO: Endpoint requires error message
 * @name backend/users/:id/GROUPS
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
router.get("/:id/groups", paramValidator(userParamsValidator), async function (req, res) {
  let response = await getUserGroups(req.params.id);
  return sendResponse(res, response);
});

/**
 * This route is not used. It is simply there to have some response to /api/users/:id/groups when using POST.
 * @getdata {void} None
 * @postdata {void} None
 * @returns {void} Status 405: { "result": "failure", "error": "POST is not available for this route. Use GET." }
 * @name backend/users/:id/groups_POST
 * @param {string} path - Express path
 * @param {callback} callback - function handler for route
 */
// eslint-disable-next-line no-unused-vars
router.post("/:id/groups", function (req, res) {
  return sendResponse(res, httpCodes.MethodNotAllowed("POST is not available for this route. Use GET."));
});

module.exports = router;
