const Joi = require("joi");
const bson = require("bson");
const { createResponse, getResultErrors, isEmpty, createModel } = require("../modules/utils");
const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");
const {getGroupInternal, isGroupMember, isGroupAdmin, getPollInternal, getQuestionInternal} = require("./modelUtils");

const pollValidators = {
  title: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(30),
  group: Joi.string(),
};

const pollSchema = {
  Title: "",
  Description: "",
  Group: "",
  Public: false,
  Questions: [],
};

const questionSchema = {
  _id: false,
  Text: "",
  Answers: [],
};

const answerSchema = {
  _id: false,
  Text: "",
  Correct: false,
};

const createPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
  group: pollValidators.group.required(),
});

const editPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
});

const createQuestionValidator = Joi.object({
  text: Joi.string().required(),
  answers: Joi.array().items(Joi.object({
    text: Joi.string().required(),
    correct: Joi.boolean().required(),
  }))
});

const editQuestionValidator = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.string(),
    text: Joi.string().required(),
    correct: Joi.boolean().required(),
  }))
});

const getQuestion = function(question, isAdmin) {
  let answers = [];
  for (let answer of question.Answers) {
    answers.push({
      id: answer._id,
      text: answer.Text,
      correct: isAdmin ? answer.Correct : null,
    });
  }
  return {
    id: question._id,
    text: question.Text,
    answers: answers,
  };
};

const getPoll = async function(pollID, userID) {
  try {
    let poll = await getPollInternal(pollID);
    let isAdmin = await isGroupAdmin(poll.Group, userID);
    let isMember = await isGroupMember(poll.Group, userID);
    if (isAdmin || isMember) {
      let questions = [];
      for (let question of poll.Questions) {
        questions.push(getQuestion(question, isAdmin));
      }
      return httpCodes.Ok({
        title: poll.Title,
        description: poll.Description,
        questions: questions,
      });
    } else {
      return httpCodes.Unauthorized();
    }
  } catch(err) {
    return httpCodes.BadRequest();
  }
};

const createPoll = async function(userID, pollData) {
  try {
    let group = await getGroupInternal(pollData.group);
    let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }
    let poll = createModel(pollSchema, {
      Title: pollData.title,
      Description: pollData.description,
      Group: group._id,
    });
    const result = await mongoConnection.getDB().collection("polls").insertOne(poll);
    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"$addToSet": {
        "Polls": result.insertedId,
      }}
    );
    return httpCodes.Ok({
      id: result.insertedId,
    });
  } catch (err) {
    console.log(err);
    return httpCodes.BadRequest();
  }
};

const editPoll = async function(pollID, userID, pollData) {
  try {
    let poll = await getPollInternal(pollID);
    let group = await getGroupInternal(poll.Group);
    let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
    if (!isUserGroupAdmin) {
      return httpCodes.Unauthorized();
    }
    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id },
      { "$set": {
        Title: pollData.title,
        Description: pollData.description,
      }}
    );
    return httpCodes.Ok();
  } catch (err) {
    console.log(err);
    return httpCodes.InternalServerError("An error occurred while writing to the database.");
  }
};

const deletePoll = async function(pollID, userID) {
  console.log(pollID, userID);
};

const createQuestion = async function(pollID, userID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    let group = await getGroupInternal(poll.Group);
    let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
    if (!isUserGroupAdmin) {
      return httpCodes.Unauthorized();
    }
    let answers = [];
    for (let answer of questionData.answers) {
      answers.push(createModel(answerSchema, {
        _id: new bson.ObjectID(),
        Text: answer.text,
        Correct: answer.correct,
      }));
    }
    let question = createModel(questionSchema, {
      _id: new bson.ObjectID(),
      Text: questionData.text,
      Answers: answers,
    });
    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id },
      { "$addToSet": {
        "Questions": question,
      }}
    );
    return httpCodes.Ok(getQuestion(question, isUserGroupAdmin));
  } catch (err) {
    console.log(err);
    return httpCodes.InternalServerError("An error occurred while writing to the database.");
  }
};

const editQuestion = async function(pollID, userID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    let isUserGroupAdmin = await isGroupAdmin(poll.Group, userID);
    if (!isUserGroupAdmin) {
      return httpCodes.Unauthorized();
    }
    let question = await getQuestionInternal(poll._id, questionData.id);
    let answers = [];
    for (let answer of question.Answers) {
      for (let answerData of questionData.answers) {
        if (answerData.id) {
          let answerDataID = new bson.ObjectID(answerData.id);
          if (answerDataID.toString() === answer._id.toString()) {
            answers.push({
              _id: answer._id,
              Text: answerData.text,
              Correct: answerData.correct,
            });
            break;
          }
        }
      }
    }
    for (let answer of questionData.answers) {
      if (!answer.id) {
        answers.push(createModel(answerSchema, {
          _id: new bson.ObjectID(),
          Text: answer.text,
          Correct: answer.correct,
        }));
      }
    }
    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id, "Questions._id": question._id, },
      { "$set": {
        "Questions.$.Text": questionData.text,
        "Questions.$.Answers": answers,
      }}
    );
    let updatedQuestion = await getQuestionInternal(poll._id, questionData.id);
    return httpCodes.Ok(getQuestion(updatedQuestion, isUserGroupAdmin));
  } catch (err) {
    console.log(err);
    return httpCodes.InternalServerError("An error occurred while writing to the database.");
  }
};

const deleteQuestion = async function(userID, pollID, questionID) {
  console.log(userID, pollID, questionID);
};

module.exports = {
  getPoll,
  createPoll,
  editPoll,
  createQuestion,
  editQuestion,
  pollSchema,
  createPollValidator,
  editPollValidator,
  createQuestionValidator,
  editQuestionValidator
};
