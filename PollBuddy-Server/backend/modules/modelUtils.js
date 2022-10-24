const bson = require("bson");
const mongoConnection = require("./mongoConnection.js");

function getID(ID) {
  return new bson.ObjectID(ID);
}

async function getGroupInternal(groupID) {
  let idCode = new bson.ObjectID(groupID);
  return await mongoConnection.getDB().collection("groups").findOne({"_id": idCode});
}

async function isGroupAdmin(groupID, userID) {
  let idCode = new bson.ObjectID(groupID);
  let group = await mongoConnection.getDB().collection("groups").findOne({"_id": idCode});
  for (let admin of group.Admins) {
    if (admin.toString() === userID.toString()) {
      return true;
    }
  }
  return false;
}

async function isGroupMember(groupID, userID) {
  let idCode = new bson.ObjectID(groupID);
  let group = await mongoConnection.getDB().collection("groups").findOne({"_id": idCode});
  for (let member of group.Members) {
    if (member.toString() === userID.toString()) {
      return true;
    }
  }
  return false;
}

function isGroupAdminByGroup(group, userID) {
  let isAdmin = group.Admins.find((adminID) => {
    return adminID.toString() === userID.toString();
  });
  if (isAdmin) {
    return true;
  } else {
    return false;
  }
}

function isGroupMemberByGroup(group, userID) {
  let isMember = group.Members.find((memberID) => {
    return memberID.toString() === userID.toString();
  });
  if (isMember) {
    return true;
  } else {
    return false;
  }
}

function isGroupUserByGroup(group, userID) {
  return isGroupAdminByGroup(group, userID) || isGroupMemberByGroup(group, userID);
}

async function getPollInternal(pollID) {
  let idCode = new bson.ObjectID(pollID);
  return await mongoConnection.getDB().collection("polls").findOne({"_id": idCode});
}

async function getUserInternal(userID) {
  let idCode = new bson.ObjectID(userID);
  return await mongoConnection.getDB().collection("users").findOne({"_id": idCode});
}

async function getQuestionInternal(pollID, questionID) {
  let poll = await getPollInternal(pollID);
  for (let question of poll.Questions) {
    if (question._id.toString() === questionID.toString()) {
      return question;
    }
  }
}

async function isPollAdmin(userID, pollID) {
  let poll = await getPollInternal(pollID);
  if (poll.Group) {
    let group = await getGroupInternal(poll.Group);
    let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
    if (!isUserGroupAdmin) {
      return false;
    }
  } else {
    let isUserPollCreator = poll.Creator.toString() === userID.toString();
    if (!isUserPollCreator) {
      return false;
    }
  }
  return true;
}

module.exports = {
  getGroupInternal,
  isGroupMember,
  isGroupAdmin,
  getPollInternal,
  getUserInternal,
  getQuestionInternal,
  isPollAdmin,
  getID,
  isGroupAdminByGroup,
  isGroupMemberByGroup,
  isGroupUserByGroup,
};
