const Joi = require("joi");
const bson = require("bson");
const { createResponse, getResultErrors, isEmpty, createModel } = require("../modules/utils");
const mongoConnection = require("../modules/mongoConnection.js");
const { httpCodes, sendResponse } = require("../modules/httpCodes.js");
const {getGroupInternal, isGroupMember, isGroupAdmin, getPollInternal, getQuestionInternal, isPollAdmin} = require("../modules/modelUtils");
const {objectID} = require("../modules/validatorUtils");

const pollValidators = {
  title: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(30),
  group: Joi.string(),
};

const pollParamsValidator = Joi.object({
  id: Joi.custom(objectID).required(),
});

const pollSchema = {
  Title: "",
  Description: "",
  Group: false, //TODO: Change to OwnerGroup
  Creator: false, //TODO: Change to OwnerUser
  RequiresLogin: true,
  AllowSubmissions: false,
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
  UserID: false,
  Questions: [],
};

const PollAnswerQuestionSchema = {
  QuestionID: "",
  Answers: [],
};

const createPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
  group: pollValidators.group,
});

const editPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
  allowSubmissions: Joi.boolean().required(),
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
  id: Joi.custom(objectID).required(),
  text: Joi.string().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.custom(objectID),
    text: Joi.string().required(),
    correct: Joi.boolean().required(),
  })).required(),
  maxAllowedChoices: Joi.number().required(),
});

const submitQuestionValidator = Joi.object({
  id: Joi.custom(objectID).required(),
  answers: Joi.array().items(Joi.custom(objectID)).required(),
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
    selectedAnswers: [],
  };
};

/**
 * errorCode === 100 means that the poll does not exist

*/

const getPoll = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound({
        errorCode: 100,
        errorMessage: "Invalid Poll: Poll does not exist."
      });
    }

    let isUserPollAdmin = false;
    if (userID) {
      isUserPollAdmin = await isPollAdmin(userID, pollID);
    }
    if (!isUserPollAdmin) {
      if(poll.AllowSubmissions) {
        if (userID) {
          if (poll.Group) {
            let isUserGroupMember = await isGroupMember(poll.Group, userID);
            if (!isUserGroupMember) {
              return httpCodes.Forbidden({
                errorCode: 101,
                errorMessage: "User is not part of Group"
              });
            }
          }
        } else {    //user is not logged in, but if poll is part of a group they shouldnt access it
          if (poll.RequiresLogin) {
            return httpCodes.Unauthorized({
              errorCode: 102,
              errorMessage: "Poll requires a log-in"
            });
          } else if (poll.Group) { //user not logged in and poll is part of a group
            return httpCodes.Forbidden({
              errorCode: 101,
              errorMessage: "User is not part of Group"
            });
          }
        }
      } else {
        return httpCodes.Forbidden({
          errorCode: 103,
          errorMessage: "Poll not Visible"
        });
      }
    }

    let questions = [];
    for (let question of poll.Questions) {
      questions.push(getQuestion(question, isUserPollAdmin));
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
      allowSubmissions: poll.AllowSubmissions,
      questions: questions,
    });
  } catch(err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};


const getPollResults = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized(); }

    let questions = [];
    let questionResults = {};

    for (let question of poll.Questions) {
      questionResults[question._id] = {};
      for (let answer of question.Answers) {
        questionResults[question._id][answer._id] =  {
          count: 0,
        };
      }
      let questionData = getQuestion(question, true);
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
        answer.count = questionResults[question.id][answer.id].count;
      }
    }

    return httpCodes.Ok({
      title: poll.Title,
      description: poll.Description,
      questions: questions,
    });
  } catch(err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const createPoll = async function(userID, pollData) {
  try {
    let newPoll = {
      Title: pollData.title,
      Description: pollData.description,
      MaxAllowedChoices: pollData.maxAllowedChoices,
    };

    if (pollData.group) {
      let group = await getGroupInternal(pollData.group);
      if (!group) { return httpCodes.BadRequest("Invalid Group: Group does not exist."); }

      let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
      if (!isUserGroupAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot create poll in this group."); }
      newPoll.Group = group._id;
    } else {
      newPoll.Creator = userID;
    }

    let poll = createModel(pollSchema, newPoll);
    const result = await mongoConnection.getDB().collection("polls").insertOne(poll);

    if (poll.Group) {
      await mongoConnection.getDB().collection("groups").updateOne(
        { _id: poll.Group, },
        {"$addToSet": {
          "Polls": result.insertedId,
        }}
      );
    }

    return httpCodes.Ok({
      id: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const editPoll = async function(userID, pollID, pollData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot Edit Poll"); }

    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id },
      { "$set": {
        Title: pollData.title,
        Description: pollData.description,
        AllowSubmissions: pollData.allowSubmissions,
      }}
    );
    return httpCodes.Ok();
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const deletePoll = async function(userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot Delete Poll"); }

    await mongoConnection.getDB().collection("polls").deleteOne({ _id: poll._id });

    if (poll.Group) {
      await mongoConnection.getDB().collection("groups").updateOne(
        { _id: poll.Group, },
        {"$pull": {
          "Polls": poll._id,
        }}
      );
    }
    return httpCodes.Ok();
  } catch(err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const createQuestion = async function(userID, pollID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot Create Poll"); }

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
    return httpCodes.Ok(getQuestion(question, true));
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const editQuestion = async function(userID, pollID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot Edit Question"); }

    let question = await getQuestionInternal(poll._id, questionData.id);
    if (!question) { return httpCodes.BadRequest("Invalid Question: Question does not exist."); }

    let answers = [];
    for (let newAnswer of questionData.answers) {
      let oldAnswer = null;
      if (newAnswer.id) {
        oldAnswer = question.Answers.find((e) => {
          return newAnswer.id.toString() === e._id.toString();
        });
      }
      let id = new bson.ObjectID();
      if (oldAnswer) {
        id = oldAnswer._id;
      }
      answers.push({
        _id: id,
        Text: newAnswer.text,
        Correct: newAnswer.correct,
      });
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
    return httpCodes.Ok(getQuestion(updatedQuestion, true));
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const deleteQuestion = async function(userID, pollID, questionID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) { return httpCodes.Unauthorized("Unauthorized: Cannot Delete Question"); }

    await mongoConnection.getDB().collection("polls").updateOne(
      { _id: poll._id },
      { "$pull": {
        "Questions.$._id": questionID.id,
      }}
    );

    return httpCodes.Ok();
  } catch(err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const submitQuestion = async function(userID, pollID, submitData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) { return httpCodes.NotFound("Invalid Poll: Poll does not exist."); }

    let question = await getQuestionInternal(poll._id, submitData.id);
    if (!question) { return httpCodes.BadRequest("Invalid Question: Question does not exist."); }

    let pollAnswers = null;
    if (userID) {
      pollAnswers = await mongoConnection.getDB().collection("poll_answers")
        .findOne({ PollID: poll._id, UserID: userID });
    }

    if (!pollAnswers) {
      let newPollAnswer = {
        PollID: poll._id,
        Questions: [{
          QuestionID: submitData.id,
          Answers: submitData.answers,
        }]
      };
      if (userID) {
        newPollAnswer.UserID = userID;
      }
      await mongoConnection.getDB().collection("poll_answers").insertOne(newPollAnswer);
    } else {
      let oldAnswers = pollAnswers.Questions.find((q) => {
        return q.QuestionID.toString() === submitData.id.toString();
      });
      if (oldAnswers) {
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
    console.error(err);
    return httpCodes.InternalServerError();
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
  questionSchema,
  createPollValidator,
  editPollValidator,
  createQuestionValidator,
  editQuestionValidator,
  submitQuestionValidator,
  pollParamsValidator
  
};
