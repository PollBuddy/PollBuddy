const {sendResponse, httpCodes} = require("./httpCodes");
const Joi = require("joi");
const bson = require("bson");

const objectID = (value, helpers) => {
  let validate = Joi.string().hex().length(24).validate(value);
  if (validate.error) {
    return helpers.error("any.invalid");
  }
  try {
    return new bson.ObjectID(value);
    
  } catch (err) {
    return helpers.error("any.invalid");
  }
};

function paramValidator(validator) {
  return function (req, res, next) {
    let result = validator.validate(req.params);
    if (result.error) {
      return sendResponse(res, httpCodes.BadRequest());
    }
    req.params = result.value;
    next();
  };
}

function bodyValidator(validator) {
  return function (req, res, next) {
    let result = validator.validate(req.body, {
      abortEarly: false,
    });
    if (result.error) {
      console.log(result.error);
      return sendResponse(res, httpCodes.BadRequest());
    }
    req.body = result.value;
    next();
  };
}

module.exports = {
  paramValidator,
  bodyValidator,
  objectID,
};
