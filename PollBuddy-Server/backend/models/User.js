const Joi = require('joi');

const userLoginValidator = Joi.object({
  userName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9-._]+$/)).min(3).max(32).required(),
  email: Joi.string().email({minDomainSegments: 2}).max(320).required(),
  password: Joi.string().pattern(new RegExp('^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$')).pattern(new RegExp('^.*[0-9].*$')).pattern(new RegExp('^.*[A-Z].*$')).required(),
});

const userInformationValidator = Joi.object({
  firstname: Joi.string().pattern(new RegExp(/^[a-zA-Z]$/)).min(1).max(256).required(),
  lastname: Joi.string().pattern(new RegExp(/^[a-zA-Z]}$/)).allow('').max(256).required(),
})

const userRegisterValidator = userLoginValidator.concat(userInformationValidator);

const userSchema = {
  FirstName: "",
  FirstNameLocked: false,
  LastName: "",
  LastNameLocked: false,
  Email: "",
  EmailLocked: false,
  UserName: "",
  UserNameLocked: true,
  Password: "",
  Groups: [],
  SchoolAffiliation: "",
}

function createUser(data){
  let user = userSchema;
  for (let [key, value] of Object.entries(user)) {
    if (data[key]) {
      user[key] = data[key];
    }
  }
  return user;
}

module.exports = {
  userLoginValidator,
  userInformationValidator,
  userRegisterValidator,
  createUser
}