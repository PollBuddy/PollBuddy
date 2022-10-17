const Joi = require("joi");
const bson = require("bson");
const {createModel} = require("../modules/utils");
const mongoConnection = require("../modules/mongoConnection.js");
const {httpCodes} = require("../modules/httpCodes.js");
const {
  getGroupInternal, isGroupMember, isGroupAdmin, getPollInternal, getQuestionInternal, isPollAdmin,
  getUserInternal
} = require("../modules/modelUtils");
const {objectID} = require("../modules/validatorUtils");

const pollValidators = {
  title: Joi.string().min(1).max(32),
  description: Joi.string().min(0).max(128),
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
  OpenTime: Date.now(),
  CloseTime: Date.now() + (10 * 365.25 * 24 * 60 * 60 * 1000), // Now + 10 years
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

const createPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
  group: pollValidators.group,
});

const editPollValidator = Joi.object({
  title: pollValidators.title.required(),
  description: pollValidators.description.required(),
  openTime: Joi.date().required(),
  closeTime: Joi.date().required(),
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

const deleteQuestionValidator = Joi.object({
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

const getQuestion = function (question, isAdmin) {
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

const getPoll = async function (userID, pollID) {
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
      if (Date.now() > poll.OpenTime && Date.now() < poll.CloseTime) {
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
        } else {    //user is not logged in, but if poll is part of a group they shouldn't access it
          if (poll.RequiresLogin) {
            return httpCodes.Unauthorized({
              errorCode: 102,
              errorMessage: "Poll requires logging in"
            });
          } else if (poll.Group) { //user not logged in and poll is part of a group
            return httpCodes.Forbidden({
              errorCode: 101,
              errorMessage: "User is not part of group"
            });
          }
        }
      } else {
        return httpCodes.Forbidden({
          errorCode: 103,
          errorMessage: "Poll is not open"
        });
      }
    }

    let questions = [];
    for (let question of poll.Questions) {
      questions.push(getQuestion(question, isUserPollAdmin));
    }
    let pollAnswers = await mongoConnection.getDB().collection("poll_answers")
      .findOne({PollID: poll._id, UserID: userID});
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
      openTime: poll.OpenTime,
      closeTime: poll.CloseTime,
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};


const getPollResults = async function (userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized();
    }

    let questions = [];
    let questionResults = {};
    let questionResponses = {};

    for (let question of poll.Questions) {
      questionResults[question._id] = {};
      questionResponses[question._id] = {
        count: 0,
      };
      for (let answer of question.Answers) {
        questionResults[question._id][answer._id] = {
          count: 0,
        };
      }
      let questionData = getQuestion(question, true);
      questions.push(questionData);
    }

    await mongoConnection.getDB().collection("poll_answers")
      .find({PollID: poll._id}).forEach((pollAnswers) => {
        for (let question of pollAnswers.Questions) {
          if (questionResults[question.QuestionID]) {
            questionResponses[question.QuestionID].count++;
            for (let answerID of question.Answers) {
              if (questionResults[question.QuestionID][answerID]) {
                questionResults[question.QuestionID][answerID].count++;
              }
            }
          }
        }
      });

    for (let question of questions) {
      question.responses = questionResponses[question.id].count;
      for (let answer of question.answers) {
        answer.count = questionResults[question.id][answer.id].count;
      }
    }

    return httpCodes.Ok({
      title: poll.Title,
      description: poll.Description,
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const getPollResultsCSV = async function (userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized();
    }

    let pollAnswers = await mongoConnection.getDB().collection("poll_answers").find({PollID: poll._id}).toArray();
    let output = [];

    // Index the questions
    let questionIndexes = {};
    let questionNumber = 1;
    for (let question of poll.Questions) {
      questionIndexes[question._id.toString()] = questionNumber;
      questionNumber++;
    }

    // Go over every submitted raw database answer
    for (let rawAnswer of pollAnswers) {

      // Get the user data
      let user;
      if (rawAnswer.userID === null) {
        // No User ID was found, so the user must be anonymous
        user = {
          UserName: "Anonymous",
          Email: "Anonymous",
          FirstName: "Anonymous",
          LastName: "Anonymous",
          SchoolAffiliation: ""
        };
      } else {
        user = await getUserInternal(rawAnswer.UserID);
        if (user === null) {
          user = {
            UserName: "Deleted User",
            Email: "Deleted User",
            FirstName: "Deleted User",
            LastName: "Deleted User",
            SchoolAffiliation: ""
          };
        }
      }

      // Go over the answers to each of the questions
      for (let fullAnswer of rawAnswer.Questions) {
        // TODO: rawAnswers.Questions is supposed to be rawAnswers.Answers as per the DB schema, but migrations are required for this to work

        // Find the question for this answer
        let question = poll.Questions.filter(q => {
          return q._id.toString() === fullAnswer.QuestionID.toString();
        })[0];

        // Go over every answer option within the entire answer
        for (let individualAnswer of fullAnswer.Answers) {

          // Make a new row to store this answer
          let row = {};

          // Set up question data
          row.QuestionNumber = questionIndexes[question._id];
          row.QuestionText = question.Text;

          // Set up user data
          row.UserName = user.UserName;
          row.Email = user.Email;
          row.FirstName = user.FirstName;
          row.LastName = user.LastName;
          row.SchoolAffiliation = user.SchoolAffiliation;

          // Find the answer that's stored in the question
          let questionAnswer = question.Answers.filter(ans => {
            return ans._id.toString() === individualAnswer.toString();
          })[0];

          // Set up answer data
          // TODO: Same issue as before, DB inconsistency that needs migrations
          //row.AnswerText = questionAnswer.Content;
          row.AnswerText = questionAnswer.Text;

          // Figure out if the answer is correct
          row.Correct = questionAnswer.Correct ? "Yes" : "No";

          output.push(row);
        }
      }
    }

    return output;

  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};


const createPoll = async function (userID, pollData) {
  try {
    let newPoll = {
      Title: pollData.title,
      Description: pollData.description,
      MaxAllowedChoices: pollData.maxAllowedChoices,
      OpenTime: Date.now(),
      CloseTime: Date.now() + (24 * 60 * 60 * 1000)
    };

    if (pollData.group) {
      let group = await getGroupInternal(pollData.group);
      if (!group) {
        return httpCodes.BadRequest("Invalid Group: Group does not exist.");
      }

      let isUserGroupAdmin = await isGroupAdmin(group._id, userID);
      if (!isUserGroupAdmin) {
        return httpCodes.Unauthorized("Unauthorized: Cannot create poll in this group.");
      }
      newPoll.Group = group._id;
    } else {
      newPoll.Creator = userID;
    }

    let poll = createModel(pollSchema, newPoll);
    const result = await mongoConnection.getDB().collection("polls").insertOne(poll);

    if (poll.Group) {
      await mongoConnection.getDB().collection("groups").updateOne(
        {_id: poll.Group,},
        {
          "$addToSet": {
            "Polls": result.insertedId,
          }
        }
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

const editPoll = async function (userID, pollID, pollData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized("Unauthorized: Cannot Edit Poll");
    }

    await mongoConnection.getDB().collection("polls").updateOne(
      {_id: poll._id},
      {
        "$set": {
          Title: pollData.title,
          Description: pollData.description,
          OpenTime: pollData.openTime.valueOf(),
          CloseTime: pollData.closeTime.valueOf(),
        }
      }
    );
    return httpCodes.Ok();
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const deletePoll = async function (userID, pollID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized("Unauthorized: Cannot Delete Poll");
    }

    await mongoConnection.getDB().collection("polls").deleteOne({_id: poll._id});

    if (poll.Group) {
      await mongoConnection.getDB().collection("groups").updateOne(
        {_id: poll.Group,},
        {
          "$pull": {
            "Polls": poll._id,
          }
        }
      );
    }
    return httpCodes.Ok();
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const createQuestion = async function (userID, pollID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized("Unauthorized: Cannot Create Poll");
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
      {_id: poll._id},
      {
        "$addToSet": {
          "Questions": question,
        }
      }
    );
    return httpCodes.Ok(getQuestion(question, true));
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const editQuestion = async function (userID, pollID, questionData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized("Unauthorized: Cannot Edit Question");
    }

    let question = await getQuestionInternal(poll._id, questionData.id);
    if (!question) {
      return httpCodes.BadRequest("Invalid Question: Question does not exist.");
    }

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
      {_id: poll._id, "Questions._id": question._id,},
      {
        "$set": {
          "Questions.$.Text": questionData.text,
          "Questions.$.Answers": answers,
          "Questions.$.MaxAllowedChoices": questionData.maxAllowedChoices,
        }
      }
    );
    let updatedQuestion = await getQuestionInternal(poll._id, questionData.id);
    return httpCodes.Ok(getQuestion(updatedQuestion, true));
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const deleteQuestion = async function (userID, pollID, questionID) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    let isUserPollAdmin = await isPollAdmin(userID, pollID);
    if (!isUserPollAdmin) {
      return httpCodes.Unauthorized("Unauthorized: Cannot Delete Question");
    }

    await mongoConnection.getDB().collection("polls").updateOne(
      {_id: poll._id},
      {
        "$pull": {
          "Questions.$._id": questionID.id,
        }
      }
    );

    return httpCodes.Ok();
  } catch (err) {
    console.error(err);
    return httpCodes.InternalServerError();
  }
};

const submitQuestion = async function (userID, pollID, submitData) {
  try {
    let poll = await getPollInternal(pollID);
    if (!poll) {
      return httpCodes.NotFound("Invalid Poll: Poll does not exist.");
    }

    if (Date.now() < poll.OpenTime || Date.now() > poll.CloseTime) {
      return httpCodes.BadRequest("Poll is not open for submissions.");
    }

    let question = await getQuestionInternal(poll._id, submitData.id);
    if (!question) {
      return httpCodes.BadRequest("Invalid Question: Question does not exist.");
    }

    let pollAnswers = null;
    if (userID) {
      pollAnswers = await mongoConnection.getDB().collection("poll_answers")
        .findOne({PollID: poll._id, UserID: userID});
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
  getPollResultsCSV,
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
