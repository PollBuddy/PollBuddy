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
  MaxAllowedChoices: 1,
};

const answerSchema = {
  _id: false,
  Text: "",
  Correct: false,
};

const pollAnswerSchema = {
  PollID: "",
  UserID: "",
  Questions: [],
};

const PollAnswerQuestionSchema = {
  QuestionID: "",
  Answers: [],
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
  })),
  maxAllowedChoices: Joi.number().required(),
});

const editQuestionValidator = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.string(),
    text: Joi.string().required(),
    correct: Joi.boolean().required(),
  })),
  maxAllowedChoices: Joi.number().required(),
});

const submitQuestionValidator = Joi.object({
  id: Joi.string(),
  answers: Joi.array().items(Joi.string()),
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
    maxAllowedChoices: question.MaxAllowedChoices,
  };
};

const getPoll = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    let isAdmin = await isGroupAdmin(poll.Group, userID);
    let isMember = await isGroupMember(poll.Group, userID);
    if (isAdmin || isMember) {
      let questions = [];
      for (let question of poll.Questions) {
        questions.push(getQuestion(question, isAdmin));
      }
      let pollAnswers = await mongoConnection.getDB().collection("poll_answers")
        .findOne({ PollID: poll._id, UserID: userID });
      if (pollAnswers) {
        for (let question of questions) {
          let questionAnswers = pollAnswers.Questions.find((e) => {
            return e.QuestionID.toString() === question.id.toString();
          });
          if (questionAnswers) {
            question.selectedAnswers = questionAnswers.Answers;
          }
        }
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


const getPollResults = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    let isUserGroupAdmin = await isGroupAdmin(poll.Group, userID);
    if (!isUserGroupAdmin) { return httpCodes.Unauthorized(); }

    let questions = [];
    let questionResults = {};

    for (let question of poll.Questions) {
      questionResults[question._id] = {};
      for (let answer of question.Answers) {
        questionResults[question._id][answer._id] =  {
          count: 0,
        };
      }
      let questionData = getQuestion(question, isUserGroupAdmin);
      questions.push(questionData);
    }

    await mongoConnection.getDB().collection("poll_answers")
      .find({ PollID: poll._id }).forEach((pollAnswers) => {
        for (let question of pollAnswers.Questions) {
          if (questionResults[question.QuestionID]) {
            for (let answerID of question.Answers) {
              if (questionResults[question.QuestionID][answerID]) {
                questionResults[question.QuestionID][answerID].count++;
              }
            }
          }
        }
      });

    for (let question of questions) {
      for (let answer of question.answers) {
        console.log(questionResults[question.id][answer.id].count);
        answer.count = questionResults[question.id][answer.id].count;
      }
    }

    return httpCodes.Ok({
      title: poll.Title,
      description: poll.Description,
      questions: questions,
    });
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
      MaxAllowedChoices: pollData.maxAllowedChoices,
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
    return httpCodes.BadRequest();
  }
};

const editPoll = async function(userID, pollID, pollData) {
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
    return httpCodes.BadRequest();
  }
};

const deletePoll = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    let group = await getGroupInternal(poll.Group);
    let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
    if (!isUserGroupAdmin) {
      return httpCodes.Unauthorized();
    }
    await mongoConnection.getDB().collection("polls").deleteOne({ _id: poll._id });
    await mongoConnection.getDB().collection("groups").updateOne(
      { _id: group._id, },
      {"pull": {
        "Polls": poll._id,
      }}
    );
    return httpCodes.Ok();
  } catch(err) {
    return httpCodes.BadRequest();
  }
};

const createQuestion = async function(userID, pollID, questionData) {
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
      MaxAllowedChoices: questionData.maxAllowedChoices,
    });
    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id },
      { "$addToSet": {
        "Questions": question,
      }}
    );
    return httpCodes.Ok(getQuestion(question, isUserGroupAdmin));
  } catch (err) {
    return httpCodes.BadRequest();
  }
};

const editQuestion = async function(userID, pollID, questionData) {
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
        "Questions.$.MaxAllowedChoices": questionData.maxAllowedChoices,
      }}
    );
    let updatedQuestion = await getQuestionInternal(poll._id, questionData.id);
    return httpCodes.Ok(getQuestion(updatedQuestion, isUserGroupAdmin));
  } catch (err) {
    return httpCodes.BadRequest();
  }
};

const deleteQuestion = async function(userID, pollID, questionID) {
  console.log(userID, pollID, questionID);
};

const submitQuestion = async function(userID, pollID, submitData) {
  try {
    let poll = await getPollInternal(pollID);
    let question = await getQuestionInternal(poll._id, submitData.id);
    let pollAnswers = await mongoConnection.getDB().collection("poll_answers")
      .findOne({ PollID: poll._id, UserID: userID });
    if (!pollAnswers) {
      await mongoConnection.getDB().collection("poll_answers").insertOne({
        PollID: poll._id,
        UserID: userID,
        Questions: [{
          QuestionID: submitData.id,
          Answers: submitData.answers,
        }]
      });
    } else {
      let found = false;
      for (let questionAnswer of pollAnswers.Questions) {
        if (questionAnswer.QuestionID === submitData.id) {
          found = true;
        }
      }
      if (found) {
        await mongoConnection.getDB().collection("poll_answers").updateOne(
          {
            _id: pollAnswers._id,
            "Questions.QuestionID": submitData.id,
          },
          {
            "$set": {
              "Questions.$.Answers": submitData.answers,
            }
          },
        );
      } else {
        await mongoConnection.getDB().collection("poll_answers").updateOne(
          {
            _id: pollAnswers._id,
          },
          {
            "$addToSet": {
              "Questions": {
                QuestionID: submitData.id,
                Answers: submitData.answers,
              },
            },
          },
        );
      }
    }
    return httpCodes.Ok();
  } catch (err) {
    console.log(err);
    return httpCodes.BadRequest();
  }
};

module.exports = {
  getPoll,
  getPollResults,
  createPoll,
  editPoll,
  createQuestion,
  editQuestion,
  submitQuestion,
  deletePoll,
  pollSchema,
  createPollValidator,
  editPollValidator,
  createQuestionValidator,
  editQuestionValidator,
  submitQuestionValidator
};
