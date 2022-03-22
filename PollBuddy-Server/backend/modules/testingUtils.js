const {createModel} = require("../modules/utils.js");
const {userSchema} = require("../models/User.js");
const mongoConnection = require("../modules/mongoConnection.js");
const {groupSchema} = require("../models/Group.js");
const {pollSchema} = require("../models/Poll");

const testGroup = {
  Name: "test.group",
  Description: "test.group.description",
};

const testGroup2 = {
  Name: "test.group.2",
  Description: "test.group.description.2",
};

const testPoll = {
  Title: "sample.poll",
  Description: "sample.poll.description",
};

const testPoll2 = {
  Title: "sample.poll.2",
  Description: "sample.poll.description.2",
};

let testUser = {
  UserName: "test.account",
  Email: "test@account.com",
  Password: "K9g95p$?E@t3A$#4",
  PasswordHash: "$2a$12$8Guj3IMNNVWk/GM4q0xeleExT3QBdPe5dWpSRYvk2elRkkWPMlOPG",
  FirstName: "test",
  LastName: "account"
};

let testUser2 = {
  UserName: "test.account.2",
  Email: "test@account2.com",
  Password: "fbdbxsDzPBo6m68$",
  PasswordHash: "$2a$12$BQKM4Ml3ag38KacRJRrZhO9FRt5yg4hbp3pg3zF.2ZZPQkn5QIAV2",
  FirstName: "test.2",
  LastName: "account.2"
};

const sampleQuestion = {
  Text: "sample.question",
  Answers: [{ Text: "sample.answer", Correct: true }],
  MaxAllowedChoices: 1,
};

let createUser = async function(update) {
  let userData = {
    UserName: testUser.UserName,
    Email: testUser.Email,
    Password: testUser.PasswordHash,
    FirstName: testUser.FirstName,
    LastName: testUser.LastName
  };

  if (update) {
    for (let [key, value] of Object.entries(update)) {
      userData[key] = value;
    }
  }

  let user = createModel(userSchema, userData);
  let res = await mongoConnection.getDB().collection("users").insertOne(user);
  return res;
};

let createGroup = async function(update) {
  let groupData = {
    Name: testGroup.Name,
    Description: testGroup.Description,
  };

  if (update) {
    for (let [key, value] of Object.entries(update)) {
      groupData[key] = value;
    }
  }

  let group = createModel(groupSchema, groupData);
  let res = await mongoConnection.getDB().collection("groups").insertOne(group);
  return res;
};

let createPoll = async function(update) {
  let pollData = {
    Title: testPoll.Title,
    Description: testPoll.Description,
  };

  if (update) {
    for (let [key, value] of Object.entries(update)) {
      pollData[key] = value;
    }
  }

  let poll = createModel(pollSchema, pollData);
  let pollInsert = await mongoConnection.getDB().collection("polls").insertOne(poll);

  if (poll.Group) {
    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: poll.Group, },
      {"$addToSet": {
        "Polls": pollInsert.insertedId,
      }}
    );
  }
  return pollInsert;
};

module.exports = {
  testUser,
  testUser2,
  testGroup,
  testGroup2,
  testPoll,
  testPoll2,
  createUser,
  createGroup,
  createPoll
};
