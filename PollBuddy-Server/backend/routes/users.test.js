require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var { userSchema } = require("../models/User.js");
var { createModel } = require("../modules/utils.js");
var mongoConnection = require("../modules/mongoConnection.js");
var usersRouter = require("./users");
const { createTestScheduler } = require("@jest/core");
const { ExpectationFailed } = require("http-errors");

let mockApp = express();
let session = {};
let testUser = {
  UserName: "test.account",
  Email: "test@account.com",
  Password: "K9g95p$?E@t3A$#4",
  PasswordHash: "$2a$12$8Guj3IMNNVWk/GM4q0xeleExT3QBdPe5dWpSRYvk2elRkkWPMlOPG",
  FirstName: "test",
  LastName: "account"
};

mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: false }));
mockApp.use(function (req, res, next) {
  req.session = session;
  next();
});
mockApp.use("/api/users", usersRouter); 

let app = supertest(mockApp);

beforeAll(async () => {
  process.env.DB_URL = global.__MONGO_URI__;
  process.env.DB_NAME = global.__MONGO_DB_NAME__;
  process.env.JEST = "true";

  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db(process.env.DB_NAME);
  mongoConnection.setClient(client);
  mongoConnection.setDB(db);
});

afterAll(() => {
  setTimeout(() => {
    mongoConnection.getClient().close();
  }, 1000);
});

afterEach(async () => {
  session = {};

  let collections = await mongoConnection.getDB().listCollections().toArray();
  collections.forEach(async (collection) => {
    await mongoConnection.getDB().collection(collection.name).deleteMany({});
  });
});

let createUser = async function(userData) {
  if (!userData) {
    userData = {
      UserName: testUser.UserName,
      Email: testUser.Email,
      Password: testUser.PasswordHash,
      FirstName: testUser.FirstName,
      LastName: testUser.LastName
    };
  }
  let user = createModel(userData, userSchema);
  let res = await mongoConnection.getDB().collection("users").insertOne(user);
  return res;
};

describe("/api/users/login", () => {

  it("GET: fail", async () => {
    await app.get("/api/users/login")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with username success", async () => {
    let res = await createUser();
    let userLogin = {
      userNameEmail: testUser.UserName,
      password: testUser.Password,
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(200)
      .then((response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName);
        expect(session).toHaveProperty("userData.userID", res.insertedId);  
      });
  });

  it("POST: login with email success", async () => {
    let res = await createUser();
    let userLogin = {
      userNameEmail: testUser.UserName,
      password: testUser.Password,
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(200)
      .then((response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName);
        expect(session).toHaveProperty("userData.userID", res.insertedId);  
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
    await app.post("/api/users/register")
      .send({
        userName: testUser.UserName,
        email: testUser.Email,
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName);

        let res = await mongoConnection.getDB().collection("users").findOne({ 
          UserName: testUser.UserName,
          Email: testUser.Email,
          FirstName: testUser.FirstName,
          LastName: testUser.LastName
        });

        expect(res).toBeTruthy();
        expect(session).toHaveProperty("userData.userID", res._id);
      });    
  });

});

describe("/api/users/logout", () => {

  it("GET: logout user success", async () => {
    session = { userData: {} };
    await app.get("/api/users/logout")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(session).toEqual({});
      });    
  });

  it("POST: fail", async () => {
    await app.post("/api/users/logout")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/users/me", () => {

  it("GET: get logged in user", async () => {
    let res = await createUser();
    session = { userData: { userID: res.insertedId } };
    await app.get("/api/users/me")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
      });    
  });

  it("GET: user not logged in", async () => {
    await app.get("/api/users/me")
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: fail", async () => {
    await app.post("/api/users/me")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });
});

describe("/api/users/me/edit", () => {

  it("GET: fail", async () => {
    await app.get("/api/users/me/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: update user data", async () => {
    let res = await createUser();
    session = { userData: { userID: res.insertedId } };
    await app.post("/api/users/me/edit")
      .send({
        Action: "Add",
        FirstName: "test.2",
        LastName: "account.2",
        UserName: "test.account.2",
        Email: "test@account2.com"
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        let updatedUser = await mongoConnection.getDB().collection("users").findOne({ 
          _id: res.insertedId,
        });
        
        expect(updatedUser.FirstName).toBe("test.2");
        expect(updatedUser.LastName).toBe("account.2");
        expect(updatedUser.UserName).toBe("test.account.2");
        expect(updatedUser.Email).toBe("test@account2.com");
      });    
  });

  it("POST: user not logged in failed", async () => {
    await app.post("/api/users/me/edit")
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

});

describe("/api/users/me/groups", () => {

  it("GET: get logged in user groups success", async () => {
    let res = await createUser({
      UserName: testUser.UserName,
      Email: testUser.Email,
      Password: testUser.PasswordHash,
      FirstName: testUser.FirstName,
      LastName: testUser.LastName,
      Groups: ["12345"]
    });
    session = { userData: { userID: res.insertedId } };
    await app.get("/api/users/me/groups")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0]).toBe("12345");
      });    
  });

  it("GET: user not logged in failed", async () => {
    await app.get("/api/users/me/groups")
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: fail", async () => {
    await app.post("/api/users/me/groups")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });
  
});

describe("/api/users/:id", () => {

  it("GET: get user", async () => {
    let res = await createUser();
    await app.get("/api/users/" + res.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
      });    
  });

  it("GET: invalid userID", async () => {
    await app.get("/api/users/0")
      .expect(400)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: fail", async () => {
    await app.post("/api/users/0")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/users/:id/edit", () => {
  
  it("GET: fail", async () => {
    await app.get("/api/users/0/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: update user data", async () => {
    let res = await createUser();
    await app.post("/api/users/" + res.insertedId + "/edit")
      .send({
        Action: "Add",
        FirstName: "test.2",
        LastName: "account.2",
        UserName: "test.account.2",
        Email: "test@account2.com"
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        let updatedUser = await mongoConnection.getDB().collection("users").findOne({ 
          _id: res.insertedId,
        });
        
        expect(updatedUser.FirstName).toBe("test.2");
        expect(updatedUser.LastName).toBe("account.2");
        expect(updatedUser.UserName).toBe("test.account.2");
        expect(updatedUser.Email).toBe("test@account2.com");
      });    
  });

  it("POST: invalid userID", async () => {
    await app.post("/api/users/0/edit")
      .expect(400)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/users/:id/groups", () => {

  it("GET: get user groups success", async () => {
    let res = await createUser({
      UserName: testUser.UserName,
      Email: testUser.Email,
      Password: testUser.PasswordHash,
      FirstName: testUser.FirstName,
      LastName: testUser.LastName,
      Groups: ["12345"]
    });
    session = { userData: { userID: res.insertedId } };
    await app.get("/api/users/" + res.insertedId + "/groups")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0]).toBe("12345");
      });    
  });

  it("GET: invalid userID", async () => {
    await app.get("/api/users/0/groups")
      .expect(400)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: fail", async () => {
    await app.post("/api/users/0/groups")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});