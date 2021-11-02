require("dotenv").config();
const express = require("express");
const supertest = require("supertest");

var { userSchema } = require("../models/User.js");
var { createModel } = require("../modules/utils.js");
var mongoConnection = require("../modules/mongoConnection.js");
var usersRouter = require("./users");

let mockApp = express();
mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: false }));
mockApp.use("/api/users", usersRouter); 

let app = supertest(mockApp);

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
  mongoConnection.disconnect(function(res) {
    if (res !== true) {
      console.error(res);
    }
  });
});

afterEach(async () => {
  await mongoConnection.getDB().listCollections().toArray()
    .then((collections) => {
      collections.forEach((collection) => {
        mongoConnection.getDB().collection(collection.name).deleteMany({});
      });
    });
});

describe("/api/users/login", () => {
  
  it("GET: fail", async () => {
    await app.get("/api/users/login")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with username success", async () => {
    let user = createModel({
      UserName: "test.account",
      Email: "test@account.com",
      Password: "$2a$12$8Guj3IMNNVWk/GM4q0xeleExT3QBdPe5dWpSRYvk2elRkkWPMlOPG",
      FirstName: "test",
      LastName: "account"
    }, userSchema);
    await mongoConnection.getDB().collection("users").insertOne(user);

    let userLogin = {
      userNameEmail: "test.account",
      password: "K9g95p$?E@t3A$#4",
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(user.FirstName);
        expect(response.body.data.lastName).toBe(user.LastName);
        expect(response.body.data.userName).toBe(user.UserName);
      });    
  });

  it("POST: login with email success", async () => {
    let user = createModel({
      UserName: "test.account",
      Email: "test@account.com",
      Password: "$2a$12$8Guj3IMNNVWk/GM4q0xeleExT3QBdPe5dWpSRYvk2elRkkWPMlOPG",
      FirstName: "test",
      LastName: "account"
    }, userSchema);
    await mongoConnection.getDB().collection("users").insertOne(user);

    let userLogin = {
      userNameEmail: "test@account.com",
      password: "K9g95p$?E@t3A$#4",
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(user.FirstName);
        expect(response.body.data.lastName).toBe(user.LastName);
        expect(response.body.data.userName).toBe(user.UserName);
      });    
  });
});

describe("/api/users/register", () => {
  
  it("GET: fail", async () => {
    await app.get("/api/users/register")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: register user success", async () => {
    let user = {
      userName: "test.account",
      email: "test@account.com",
      password: "K9g95p$?E@t3A$#4",
      firstName: "test",
      lastName: "account"
    };
    await app.post("/api/users/register")
      .send(user)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(user.firstName);
        expect(response.body.data.lastName).toBe(user.lastName);
        expect(response.body.data.userName).toBe(user.userName);

        let res = await mongoConnection.getDB().collection("users").findOne({ 
          UserName: user.userName,
          Email: user.email,
          FirstName: user.firstName,
          LastName: user.lastName
        });

        expect(res).toBeTruthy();
      });    
  });
});

