const Joi = require("joi");
const bson = require("bson");
const { createResponse, getResultErrors, isEmpty, createModel } = require("../modules/utils");
const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");

const validators = {
  name: Joi.string().min(3).max(30),
};

const groupSchema = {
  Name: "",
  Description: "",
  Invites: [],
  Admins: [],
  Polls: [],
  Users: [],
};

const inviteSchema = {
  Code: "",
  ValidFrom: "",
  ValidTo: "",
  ValidUsers: [],
  UseCounter: 0,
};

const createGroupValidator = Joi.object({
  name: validators.name.required(),
});

const getGroupInternal = async function(groupID) {
  let idCode = new bson.ObjectID(groupID);
  let group = await mongoConnection.getDB().collection("groups").findOne({ "_id": idCode });
  return group;
};

const isGroupAdmin = async function(groupID, userID) {
  let idCode = new bson.ObjectID(groupID);
  let group = await mongoConnection.getDB().collection("groups").findOne({ "_id": idCode });
  for (let admin of group.Admins) {
    if (admin.toString() === userID.toString()) {
      return true;
    }
  }
  return false;
};

const isGroupMember = async function(groupID, userID) {
  let idCode = new bson.ObjectID(groupID);
  let group = await mongoConnection.getDB().collection("groups").findOne({ "_id": idCode });
  for (let user of group.Users) {
    if (user.toString() === userID.toString()) {
      return true;
    }
  }
  return false;
};

const getGroup = async function(groupID, userID) {
  try {
    const group = await getGroupInternal(groupID);
    let isMember = await isGroupMember(groupID, userID);
    let isAdmin = await isGroupAdmin(groupID, userID);
    console.log(group);
    return httpCodes.Ok({
      name: group.Name,
      description: group.Description,
      isMember: isMember,
      isAdmin: isAdmin,
    });
  } catch (err) {
    // Could not find user associated with this ID, something has gone wrong
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const createGroup = async function(groupData, userID) {
  try {
    let group = createModel(groupSchema, {
      Name: groupData.name,
      Admins: [userID],
    });
    const result = await mongoConnection.getDB().collection("groups").insertOne(group);
    return httpCodes.Ok({
      id: result.insertedId
    });
  } catch (err) {
    return httpCodes.InternalServerError("An error occurred while writing to the database.");
  }
};

const getGroupUsers = async function (groupID) {
  try {
    const group = await getGroupInternal(groupID);
    return httpCodes.Ok(group.Users);
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const getGroupAdmins = async function (groupID) {
  try {
    const group = await getGroupInternal(groupID);
    return httpCodes.Ok(group.Admins);
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const getGroupPolls = async function (groupID) {
  try {
    const group = await getGroupInternal(groupID);

    return httpCodes.Ok(group.Polls);
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const joinGroup = async function (groupID, userID) {
  try {
    let group = await getGroupInternal(groupID);
    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"$addToSet": {
        "Users": userID,
      }}
    );
    return httpCodes.Ok();
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const leaveGroup = async function (groupID, userID) {
  try {
    let group = await getGroupInternal(groupID);
    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"$pull": {
        "Users": userID,
      }}
    );
    return httpCodes.Ok();
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

const deleteGroup = async function (groupID, userID) {
  try {
    let isUserGroupAdmin = await isGroupAdmin(groupID, userID);
    if (!isUserGroupAdmin) {
      return httpCodes.Unauthorized();
    }
    let group = await getGroupInternal(groupID);
    await mongoConnection.getDB().collection("groups").deleteOne({ _id: group._id });
    return httpCodes.Ok();
  } catch(err) {
    return httpCodes.BadRequest("Error: Invalid Group, ID does not match any group.");
  }
};

module.exports = {
  createGroupValidator,
  groupSchema,
  getGroup,
  createGroup,
  getGroupUsers,
  getGroupAdmins,
  getGroupPolls,
  joinGroup,
  leaveGroup,
  deleteGroup
};
