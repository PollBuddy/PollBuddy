const Joi = require("joi");
const bson = require("bson");
const bcrypt = require("bcrypt");

const mongoConnection = require("../modules/mongoConnection.js");
const { createResponse } = require("../modules/utils");

const userLoginValidator = Joi.object({
  userName: Joi.string().pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$")).required(),
  email: Joi.string().email({tlds: {allow: false}, minDomainSegments: 2}).max(320).required(),
  password: Joi.string().pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$")).pattern(new RegExp("^.*[0-9].*$")).pattern(new RegExp("^.*[A-Z].*$")).required(),
});

const userInformationValidator = Joi.object({
  firstName: Joi.string().min(1).max(256).required(),
  lastName: Joi.string().allow("").max(256).required(),
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
    return [200, createResponse(user)];
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
    return [200, createResponse(user.Groups)];
  } else {
    // Could not find user associated with this ID, something has gone wrong
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
};

// User action:
// ->  Add | Remove
// ->  FirstName | LastName | UserName | Email | Password
const editUser = async function(userID, jsonContent) {
  // Change userID to ObjectID 
  try {
    var idCode = new bson.ObjectID(userID);
  } catch(err) {
    return [400, createResponse(null, "Error: Invalid User, ID does not match any user.")];
  }
  // Flag indicates success or not
  var success = false;
  const collection = mongoConnection.getDB().collection("users");
  // Add provided fields to the database
  if (jsonContent.Action === "Add") {
    if (jsonContent.FirstName !== undefined) {
      // Update the FirstName field in the database
      collection.updateOne({ "_id": idCode }, { "$set": { FirstName: jsonContent.FirstName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.LastName !== undefined) {
      // Update the LastName field in the database
      collection.updateOne({ "_id": idCode }, { "$set": { LastName: jsonContent.LastName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.UserName !== undefined) {
      // Update the UserName field in the database
      collection.updateOne({ "_id": idCode }, { "$set": { UserName: jsonContent.UserName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.Email !== undefined) {
      // Update the Email field in the database
      collection.updateOne({ "_id": idCode }, { "$set": { Email: jsonContent.Email } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.Password !== undefined) {
      // Update the Password field in the database
      collection.updateOne({ "_id": idCode }, { "$set": { Password: bcrypt.hashSync(jsonContent.Password, 10) } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (success) {
      // Successfully updated the database as user requested
      return [200, createResponse("Sucessfully Added Data", null)];
    } else {
      // None of the updates were successful, so the data provieded in not valid for an add operation
      return [400, createResponse("Error", "Error: No Valid Add fields provided")];
    }

    // Remove provided fields from the database
  } else if (jsonContent.Action === "Remove") {
    if (jsonContent.FirstName !== undefined) {
      // Remove the FirstName field from the database
      collection.updateOne({ "_id": idCode }, { "$pull": { FirstName: jsonContent.FirstName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.LastName !== undefined) {
      // Remove the LastName field from the database
      collection.updateOne({ "_id": idCode }, { "$pull": { LastName: jsonContent.LastName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.UserName !== undefined) {
      // Remove the UserName field from the database
      collection.updateOne({ "_id": idCode }, { "$pull": { UserName: jsonContent.UserName } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.Email !== undefined) {
      // Remove the Email field from the database
      collection.updateOne({ "_id": idCode }, { "$pull": { Email: jsonContent.Email } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (jsonContent.Password !== undefined) {
      // Remove the Password Field from the database
      collection.updateOne({ "_id": idCode }, { "$pull": { Password: bcrypt.hashSync(jsonContent.Password, 10) } })
        .then(success = true)
        .catch((err) => {
          return [500, createResponse(null, "Error updating database information")];
        });
    }
    if (success) {
      // Successfully updated the database as user requested
      return [200, createResponse("Sucessfully Removed Data", null)];
    } else {
      // No Remove actions were performed, meaning none of the provided fields were effected, so throw an error
      return [400, createResponse(null, "Error: No Valid Remove fields provided")];
    }
  } else {
    // Action is not "Add" or "Remove", so throw an error
    return [400, createResponse(null, "Error: Invalid Action, must be either Add or Remove")];
  }
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