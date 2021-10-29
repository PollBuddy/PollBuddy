const Joi = require('joi');

const groupValidator = Joi.Object({
  Name: Joi.string().min(3).max(30).required(),
});

const groupSchema = {
  Name: "",
  Description: "",
  Invites: [],
  Admins: [],
  Polls: [],
  Users: [],
};

const inviteSchema = {
  Code: "",
  ValidFrom: "",
  ValidTo: "",
  ValidUsers: [],
  UseCounter: 0,
};

