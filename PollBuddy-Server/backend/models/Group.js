const Joi = require("joi");
const bson = require("bson");
const { createResponse, getResultErrors, isEmpty, createModel } = require("../modules/utils");
const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");
const {getGroupInternal, isGroupMember, isGroupAdmin, getPollInternal, getUserInternal} = require("../modules/modelUtils");
const {objectID} = require("../modules/validatorUtils");

const validators = {
  name: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(30),
};

const groupSchema = {
  Name: "",
  Description: "",
  Admins: [],
  Polls: [],
  Users: [], //TODO: Change to member
};

const groupParamsValidator = Joi.object({
  id: Joi.custom(objectID).required(),
});

const createGroupValidator = Joi.object({
  name: validators.name.required(),
  description: validators.description.required(),
});

const editGroupValidator = Joi.object({
  name: validators.name,
  description: validators.description,
});

const getGroup = async function(groupID, userID) {
  try {
    const group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let isMember = await isGroupMember(groupID, userID);
    let isAdmin = await isGroupAdmin(groupID, userID);
    return httpCodes.Ok({
      name: group.Name,
      description: group.Description,
      isMember: isMember,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const createGroup = async function(userID, groupData) {
  try {
    let group = createModel(groupSchema, {
      Name: groupData.name,
      Description: groupData.description,
      Admins: [userID],
    });
    const result = await mongoConnection.getDB().collection("groups").insertOne(group);
    return httpCodes.Ok({
      id: result.insertedId
    });
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const editGroup = async function(groupID, userID, groupData) {
  try {
    const group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let isUserGroupAdmin = await isGroupAdmin(groupID, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }

    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id },
      { "$set": {
        Name: groupData.name,
        Description: groupData.description,
      }}
    );
    return httpCodes.Ok();
  } catch (err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const getGroupUsers = async function (groupID, userID) {
  try {
    const group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let isUserGroupAdmin = await isGroupAdmin(groupID, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }

    let users = [];
    for (let groupUserID of group.Users) {
      let user = await getUserInternal(groupUserID);
      users.push({
        id: user._id,
        userName: user.UserName,
      });
    }
    return httpCodes.Ok(users);
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const getGroupAdmins = async function (groupID, userID) {
  try {
    const group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let isUserGroupAdmin = await isGroupAdmin(groupID, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }

    let admins = [];
    for (let groupAdminID of group.Admins) {
      let admin = await getUserInternal(groupAdminID);
      admins.push({
        id: admin._id,
        userName: admin.UserName,
      });
    }
    return httpCodes.Ok(admins);
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const getGroupPolls = async function (groupID) {
  try {
    const group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let polls = [];
    for (let pollID of group.Polls) {
      let poll = await getPollInternal(pollID);
      polls.push({
        id: poll._id,
        title: poll.Title,
      });
    }
    return httpCodes.Ok(polls);
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const joinGroup = async function (groupID, userID) {
  try {
    let group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"$addToSet": {
        "Users": userID,
      }}
    );
    return httpCodes.Ok();
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const leaveGroup = async function (groupID, userID) {
  try {
    let group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"$pull": {
        "Users": userID,
      }}
    );
    return httpCodes.Ok();
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
  }
};

const deleteGroup = async function (groupID, userID) {
  try {
    let group = await getGroupInternal(groupID);
    if (!group) { return httpCodes.BadRequest(); }

    let isUserGroupAdmin = await isGroupAdmin(groupID, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }
    await mongoConnection.getDB().collection("groups").deleteOne({ _id: group._id });
    return httpCodes.Ok();
  } catch(err) {
    console.log(err);
    return httpCodes.InternalServerError();
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
  deleteGroup,
  editGroup,
  editGroupValidator,
  groupParamsValidator
};
