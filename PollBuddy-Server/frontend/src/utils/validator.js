const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^(?=.{3,32}$)[a-zA-Z0-9\-._]+$'))
    .error(new Error('Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.')),
  email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2})
    .max(320)
    .error(new Error('Invalid email format.')),
  password: Joi.string()
    .pattern(new RegExp('^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$'))
    .pattern(new RegExp('^.*[0-9].*$'))
    .pattern(new RegExp('^.*[A-Z].*$'))
    .error(new Error('Invalid password. Must contain 10 or more characters, ' +
      'at least 1 uppercase letter, and at least 1 number. ' +
      'Cannot have 4 of the same characters in a row.')),
  firstname: Joi.string()
    .min(1)
    .max(256)
    .error(new Error('First name must be between 1 and 256 characters.')),
  lastname: Joi.string()
    .allow('')
    .max(256)
    .error(new Error('Last name must be less than 256 characters.')),
});

function validateFieldJOI(field, val) {
  switch(field.toString()) {
    case 'firstName':
      return schema.validate({ firstname: val });
      break;
    case 'lastName':
      return schema.validate({ lastname: val });
      break;
    case 'userName':
      return schema.validate({ username: val });
      break;
    case 'password':
      return schema.validate({ password: val });
      break;
    case 'email':
      return schema.validate({ email: val });
      break;
    default:
      break;
  }
}

export default function validateUserData(userData) {
  let userObj = {};

  for(field in userData) {
    let valid = validateFieldJOI(field, userData[field]);

    userObj[field] = { valid: valid, value: valid ? userData[field] : null, error: !valid ? userData[field] : null  }
  }
}