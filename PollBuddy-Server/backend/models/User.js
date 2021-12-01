const Joi = require("joi");
const bson = require("bson");
const bcrypt = require("bcrypt");

const mongoConnection = require("../modules/mongoConnection.js");
const { createResponse, getResultErrors, isEmpty } = require("../modules/utils");

const validators = {
  userName: Joi.string().pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$")),
  email: Joi.string().email({tlds: {allow: false}, minDomainSegments: 2}).max(320),
  password: Joi.string().pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$")).pattern(new RegExp("^.*[0-9].*$")).pattern(new RegExp("^.*[A-Z].*$")),
  firstName: Joi.string().min(1).max(256),
  lastName: Joi.string().allow("").max(256),
};

const userLoginValidator = Joi.object({
  userName: validators.userName.required(),
  email: validators.email.required(),
  password: validators.password.required(),
});

const userInformationValidator = Joi.object({
  firstName: validators.firstName.required(),
  lastName: validators.lastName.required(),
});

const userRegisterValidator = userLoginValidator.concat(userInformationValidator);

const userSchema = {
  FirstName: "",
  FirstNameLocked: false,
  LastName: "",
  LastNameLocked: false,
  Email: "",
  EmailLocked: false,
  UserName: "",
  UserNameLocked: true,
  Password: "",
  Groups: [],
  SchoolAffiliation: "",
};

const getUser = async function(userID) {
  // Change userID to ObjectID 
  try {
    var idCode = new bson.ObjectID(userID);
  } catch(err) {
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
  // Locate user data in database
  const user = await mongoConnection.getDB().collection("users").findOne({ "_id": idCode });
  if (user) {
    // Found user, and return the user data in a JSON Object
    return [200, createResponse({
      firstName: user.FirstName,
      lastName: user.LastName,
      userName: user.UserName,
      email: user.Email,
    })];
  } else {
    // Could not find user associated with this ID, something has gone wrong
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
};

const getUserGroups = async function(userID) {
  // Change userID to ObjectID 
  try {
    var idCode = new bson.ObjectID(userID);
  } catch(err) {
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
  // Locate user data in database
  const user = await mongoConnection.getDB().collection("users").findOne({ "_id": idCode });
  if (user) {
    // Found user, and return the list of groups
    // TODO: needs to be updated via issue #591
    return [200, createResponse({ "admin": [
      { "id": 1, "name": "Example Group 1" },
      { "id": 2, "name": "Example Group 2" }
      ], "member": [
        { "id": 3, "name": "Example Group 3" },
        { "id": 4, "name": "Example Group 4" }] })];
    //return [200, createResponse(user.Groups)];
  } else {
    // Could not find user associated with this ID, something has gone wrong
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
};


const editUser = async function(userID, jsonContent) {
  try {
    var idCode = new bson.ObjectID(userID);
  } catch(err) {
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }

  const users = mongoConnection.getDB().collection("users");
  const user = await users.findOne({ "_id": idCode });

  if (!user) {
    return [500, createResponse(null, "Error updating database information")];
  }

  const updatedUser = Joi.object({
    UserName: validators.userName,
    FirstName: validators.firstName,
    LastName: validators.lastName,
    Email: validators.email,
    Password: validators.password,
    LogOutEverywhere: Joi.boolean(),
  }).validate({
    UserName: jsonContent.userName,
    FirstName: jsonContent.firstName,
    LastName: jsonContent.lastName,
    Email: jsonContent.email,
    Password: jsonContent.password,
    LogOutEverywhere: jsonContent.logOutEverywhere,
  });

  const errors = getResultErrors(updatedUser);
  if (updatedUser.value["Password"] && updatedUser.value["LogOutEverywhere"] === undefined) {
    errors["Password"] = "LogOutEverywhere is required when Password is passed";
  }

  Object.keys(updatedUser.value).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(userSchema, key) || updatedUser.value[key] === undefined) {
      delete updatedUser.value[key];
    } else if(user[key + "Locked"]) {
      errors[key] = key + " locked.";
    }
  });


  if (updatedUser.value["Password"]) {
    if (user.SchoolAffiliation) {
      errors["Password"] = "Password locked.";
    } else {
      updatedUser.value["Password"] = bcrypt.hashSync(updatedUser.value["Password"], 10);
    }
  }

  if (!isEmpty(errors)) {
    return [400, createResponse(errors, "Validation Failed")];
  }

  users.updateOne({ "_id": idCode }, { "$set": updatedUser.value })
    .catch(() => {
      return [500, createResponse(null, "Error updating database information")];
    });

  return getUser(idCode);
};

module.exports = {
  userLoginValidator,
  userInformationValidator,
  userRegisterValidator,
  userSchema,
  getUser,
  getUserGroups,
  editUser
};