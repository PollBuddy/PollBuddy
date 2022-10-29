const bson = require("bson");
const mongoConnection = require("./mongoConnection.js");

const getID = function (ID) {
  return new bson.ObjectID(ID);
};

const getGroupInternal = async function(query={}) {
  return await mongoConnection.getDB().collection("groups").findOne(query);
};

const isGroupAdmin = async function(groupID, userID) {
  let group = getGroupInternal({"_id": groupID, "Admins": userID});
  if (group) {
    return true;
  }
  return false;
};

const isGroupMember = async function(groupID, userID) {
  let group = await getGroupInternal({"_id": groupID, "Members": userID});
  if (group) {
    return true;
  }
  return false;
};

const isGroupAdminByGroup = function(group, userID) {
  let isAdmin = group.Admins.find((adminID) => {
    return adminID.toString() === userID.toString();
  });
  if (isAdmin) {
    return true;
  } else {
    return false;
  }
};

const isGroupMemberByGroup = function(group, userID) {
  let isMember = group.Members.find((memberID) => {
    return memberID.toString() === userID.toString();
  });
  if (isMember) {
    return true;
  } else {
    return false;
  }
};

const isGroupUserByGroup = function(group, userID) {
  return isGroupAdminByGroup(group, userID) || isGroupMemberByGroup(group, userID);
};

const getPollInternal = async function(query={}) {
  return await mongoConnection.getDB().collection("polls").findOne(query);
};

const getUserInternal = async function(query={}) {
  let idCode = new bson.ObjectID(query["_id"]);
  query["_id"] = idCode;
  return await mongoConnection.getDB().collection("users").findOne({"_id": idCode});
};

const getQuestionInternal = async function(pollID, questionID) {
  let poll = await getPollInternal({"_id": pollID});
  for (let question of poll.Questions) {
    if (question._id.toString() === questionID.toString()) {
      return question;
    }
  }
};

const getQuestionInternalByPoll = async function(poll, questionID) {
  for (let question of poll.Questions) {
    if (question._id.toString() === questionID.toString()) {
      return question;
    }
  }
};

const isPollAdmin = async function(userID, pollID) {
  let poll = await getPollInternal({"_id": pollID});
  if (poll.Group) {
    let group = await getGroupInternal({"_id": poll.Group, "Admins": userID});
    if (!group) { return false; }
  } else {
    let isUserPollCreator = poll.Creator.toString() === userID.toString();
    if (!isUserPollCreator) { return false; }
  }
  return true;
};

const isPollAdminByPoll = async function(userID, poll) {
  if (poll && poll.Group) {
    let group = await getGroupInternal({"_id": poll.Group, "Admins": userID});
    if (!group) { return false; }
  } else {
    let isUserPollCreator = poll.Creator.toString() === userID.toString();
    if (!isUserPollCreator) { return false; }
  }
  return true;
};

module.exports = {
  getGroupInternal,
  isGroupMember,
  getPollInternal,
  getUserInternal,
  getQuestionInternal,
  isPollAdmin,
  isPollAdminByPoll,
  getID,
  isGroupAdminByGroup,
  isGroupMemberByGroup,
  isGroupUserByGroup,
  getQuestionInternalByPoll
};
