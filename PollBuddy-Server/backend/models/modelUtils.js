const bson = require("bson");
const mongoConnection = require("../modules/mongoConnection.js");

const getID = function (ID) {
  return new bson.ObjectID(ID);
};

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

const getPollInternal = async function(pollID) {
  let idCode = new bson.ObjectID(pollID);
  let poll = await mongoConnection.getDB().collection("polls").findOne({ "_id": idCode });
  return poll;
};

const getUserInternal = async function(userID) {
  let idCode = new bson.ObjectID(userID);
  return await mongoConnection.getDB().collection("users").findOne({ "_id": idCode });
};

const getQuestionInternal = async function(pollID, questionID) {
  let poll = await getPollInternal(pollID);
  for (let question of poll.Questions) {
    if (question._id.toString() === questionID.toString()) {
      return question;
    }
  }
};

module.exports = {
  getGroupInternal,
  isGroupMember,
  isGroupAdmin,
  getPollInternal,
  getUserInternal,
  getQuestionInternal,
  getID
};
