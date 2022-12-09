const {sendResponse, httpCodes} = require("./httpCodes");
const Joi = require("joi");
const bson = require("bson");

const codeID = (value, helpers) => {
  let validate = Joi.string().hex().length(13).validate(value);
  if (validate.error) {
    return helpers.error("any.invalid");
  }
  try {
    return value;
  } catch (err) {
    return helpers.error("any.invalid");
  }
};

const objectID = (value, helpers) => {
  let validate = Joi.string().hex().length(24).validate(value);
  if (validate.error) {
    return helpers.error("any.invalid");
  }
  try {
    let id = new bson.ObjectID(value);
    return id;
  } catch (err) {
    return helpers.error("any.invalid");
  }
};

function paramValidator(validator) {
  return function (req, res, next) {
    let result = validator.validate(req.params);
    if (result.error) {
      sendResponse(res, httpCodes.BadRequest());
      return;
    }
    req.params = result.value;
    next();
  };
}

function bodyValidator(validator) {
  return function (req, res, next) {
    let result = validator.validate(req.body);
    if (result.error) {
      sendResponse(res, httpCodes.BadRequest());
      return;
    }
    req.body = result.value;
    next();
  };
}


module.exports = {
  paramValidator,
  bodyValidator,
  objectID,
  codeID,
};
