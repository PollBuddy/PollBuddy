const {sendResponse, httpCodes} = require("./httpCodes");
const Joi = require("joi");
const bson = require("bson");

function paramValidator(params) {
  return function(req, res, next) {
    let validID = params.validate(req.params);
    if (validID.error) {
      console.error("Invalid Params", validID);
      return sendResponse(res, httpCodes.BadRequest());
    }
    next();
  };
}

const objectID = (value, helpers) => {
  let validate = Joi.string().hex().length(24).validate(value);
  if (validate.error) {
    return helpers.error("any.invalid");
  }
  try {
    let id = new bson.ObjectID(value);
    return id;
  } catch(err) {
    return helpers.error("any.invalid");
  }
};

module.exports = {
  paramValidator,
  objectID,
};