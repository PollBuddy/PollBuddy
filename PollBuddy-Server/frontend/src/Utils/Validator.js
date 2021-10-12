const Joi = require("joi");

/* Define Schema as per Wiki requirements for each field */
const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9\-._]+$"))
    .error(new Error("Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.")),
  email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2})
    .max(320)
    .error(new Error("Invalid email format.")),
  password: Joi.string()
    .pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$"))
    .pattern(new RegExp("^.*[0-9].*$"))
    .pattern(new RegExp("^.*[A-Z].*$"))
    .error(new Error("Invalid password. Must contain 10 or more characters, " +
      "at least 1 uppercase letter, and at least 1 number. " +
      "Cannot have 4 of the same characters in a row.")),
  firstname: Joi.string()
    .min(1)
    .max(256)
    .error(new Error("First name must be between 1 and 256 characters.")),
  lastname: Joi.string()
    .allow("")
    .max(256)
    .error(new Error("Last name must be less than 256 characters.")),
});

/**
 * Validate a value based on schema field given
 * @param {string} field - The field from the schema that you want to validate
 * @param {string} val - The value that you want to validate
 * @returns {object} - the validation object from Joi
 */
function validateFieldJOI(field, val) {
  // Validate value with corresponding field
  switch(field.toString()) {
  case "firstName":
    return schema.validate({ firstname: val });
  case "lastName":
    return schema.validate({ lastname: val });
  case "userName":
    return schema.validate({ username: val });
  case "password":
    return schema.validate({ password: val });
  case "email":
    return schema.validate({ email: val });
  default:
    break;
  }
}

/**
 * Create a userObj that validates the user data provided
 * @param {object} userData - Data provided that needs to be validated with schema
 * @returns {object} - Contains valid {boolean}, value {object}, and error {string}
 */
export default function validateUserData(userData) {
  let userObj = {};

  for(let field in userData) {
    let valid = validateFieldJOI(field, userData[field]);

    userObj[field] = { valid: !valid.error ? true : false, value: valid ? userData[field] : null, error: valid.error ? valid.error.toString() : null  };
  }

  return userObj;
}