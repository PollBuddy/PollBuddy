require("dotenv").config();
const express = require("express");
const supertest = require("supertest");

var mongoConnection = require("../modules/mongoConnection.js");
var usersRouter = require("./users");

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", usersRouter); 

beforeAll(() => {
  process.env.DB_URL = global.__MONGO_URI__;
  process.env.DB_NAME = global.__MONGO_DB_NAME__;
  process.env.JEST = "true";

  console.log(global.__MONGO_URI__);
  console.log(global.__MONGO_DB_NAME__);

  mongoConnection.connect(function (res) {
    if (res !== true) {
      console.error(res);
    }
  });
});

afterAll(() => {
  mongoConnection.disconnect(function (res) {
    if (res !== true) {
      console.error(res);
    }
  });
});

describe('/api/users/register', () => {
  it('GET: fail', async () => {
    await supertest(app).get("/api/users/register")
      .expect(405);
  });

  it('POST: register user success', async () => {
    let user = {
      userName: "test.account",
      email: "test@account.com",
      password: "K9g95p$?E@t3A$#4",
      firstName: "test",
      lastName: "account"
    };
    await supertest(app).post("/api/users/register")
      .send(user)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(user.firstName);
        expect(response.body.data.lastName).toBe(user.lastName);
        expect(response.body.data.userName).toBe(user.userName);

        let res = await mongoConnection.getDB().collection('users').findOne({ 
          UserName: user.userName,
          Email: user.email,
          FirstName: user.firstName,
          LastName: user.lastName
        });

        expect(res).toBeTruthy();
      });    
  });
});