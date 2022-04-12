require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
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


let testUser2 = {
  UserName: "test.account.2",
  Email: "test@account2.com",
  Password: "fbdbxsDzPBo6m68$",
  PasswordHash: "$2a$12$BQKM4Ml3ag38KacRJRrZhO9FRt5yg4hbp3pg3zF.2ZZPQkn5QIAV2",
  FirstName: "test.2",
  LastName: "account.2"
};

mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: false }));
mockApp.use(function (req, res, next) {
  req.session = session;
  next();
});
mockApp.use("/api/users", usersRouter); 

let app = supertest(mockApp);

// TODO: Check Responses against Standard Responses.
// TODO: Make a Backend Testing Wiki 

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

beforeEach(async () => {
  session = {};

  let collections = await mongoConnection.getDB().listCollections().toArray();
  collections.forEach(async (collection) => {
    await mongoConnection.getDB().collection(collection.name).deleteMany({});
  });
});

let createUser = async function(update) {
  let userData = {
    UserName: testUser.UserName,
    Email: testUser.Email,
    Password: testUser.PasswordHash,
    FirstName: testUser.FirstName,
    LastName: testUser.LastName
  };

  if (update) {
    for (let [key, value] of Object.entries(update)) {
      userData[key] = value;
    }
  }
  
  let user = createModel(userSchema, userData);
  let res = await mongoConnection.getDB().collection("users").insertOne(user);
  return res;
};

let createUserSchoolAffiliated = async function(update) {
  let userData = {
    UserName: testUser.UserName,
    Email: testUser.Email,
    Password: testUser.PasswordHash,
    FirstName: testUser.FirstName,
    LastName: testUser.LastName,
    SchoolAffiliation: "RPI"
  };

  if (update) {
    for (let [key, value] of Object.entries(update)) {
      userData[key] = value;
    }
  }
  
  let user = createModel(userSchema, userData);
  let res = await mongoConnection.getDB().collection("users").insertOne(user);
  return res;
};

describe("/api/users", () => {
  it("GET: empty url request", async () => {
    await app.get("/api/users/")
      .expect(500);
  });

  it("POST: empty url request", async () => {
    await app.post("/api/users/")
      .expect(500);
  });
});

describe("/api/users/login", () => {

  it("GET: route unavailable", async () => {
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
      userNameEmail: testUser.Email,
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

  it("POST: login with email failure", async () => {
    let res = await createUser();
    let userLogin = {
      password: testUser.Password,
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(401)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with school affiliation failure", async() => {
    let res = await createUserSchoolAffiliated();
    let userLogin = {
      userNameEmail: testUser.Email,
      password: testUser.Password,
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(406)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with password failure", async() => {
    let res = await createUser();
    let userLogin = {
      userNameEmail: testUser.Email,
      password: "",
    };

    await app.post("/api/users/login", )
      .send(userLogin)
      .expect(401)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with email failure, no user found", async () => {
    let res = await createUser();
    let userLogin = {
      userNameEmail: "notauser@gmail.com",
      password: testUser.Password,
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(401)
      .then((response) => {
        expect(response.body.result).toBe("failure");
        
      });
  });

  it("POST: login with email failure, incorrect password", async () => {
    let res = await createUser();
    let userLogin = {
      userNameEmail: testUser.Email,
      password: "ajd@jdk2DDGK9933lL",
    };

    await app.post("/api/users/login")
      .send(userLogin)
      .expect(401)
      .then((response) => {
        expect(response.body.result).toBe("failure");
        
      });
  });

});



describe("/api/users/login/rpi", () => {

  it("POST: route unavailable", async() => {
    await app.post("/api/users/login/rpi")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it('GET requests login rpi failure', async () => {
    let res = await createUser();
    session = { cas_user: "notregistereduser", userData: { userID: res.insertedId } };
    await app.get("/api/users/login/rpi")
      .expect(302)
      .then(async (response) => {
      }); 
  });

  it('GET requests login rpi success', async () => {
    let res = await createUser();
    session = { userDataTemp: { userName: "__rpi_" + testUser.UserName, email: testUser.Email } };
    await app.post("/api/users/register/rpi")
      .send({
        userName: "__rpi_" + testUser.UserName,
        email: testUser.Email,
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(200).then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe("__rpi_" + testUser.UserName);

        session = { cas_user: testUser.UserName, userData: { userID: session.userData.userID } };

        await app.get("/api/users/login/rpi")
          .expect(302);
      });
  });

});


describe("/api/users/register", () => {
  
  it("GET: route unavailable", async () => {
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

  it("POST: register user empty fields failure", async () => {
    await app.post("/api/users/register")
      .send({
        userName: "__badusername",
        email: "",
        password: "",
        firstName: "",
        lastName: 4
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: register failure duplicate email", async () => {
    
    // Create unique indexes
    mongoConnection.getDB().collection("users").createIndex({"Email": 1}, {name: "email", unique: true});

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
        await app.post("/api/users/register")
          .send({
            userName: testUser.UserName,
            email: testUser.Email,
            password: testUser.Password,
            firstName: testUser.FirstName,
            lastName: testUser.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");

          });
      });

    mongoConnection.getDB().collection("users").dropIndex("email");
  });

  it("POST: register failure duplicate username", async () => {
    
    // Create unique indexes
    mongoConnection.getDB().collection("users").createIndex({"UserName": 1}, {name: "username", unique: true});

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
        await app.post("/api/users/register")
          .send({
            userName: testUser.UserName,
            email: testUser.Email,
            password: testUser.Password,
            firstName: testUser.FirstName,
            lastName: testUser.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");

          });
      });

    mongoConnection.getDB().collection("users").dropIndex("username");
  });

  it("POST: register failure duplicate other error", async () => {
    
    // Create unique indexes
    mongoConnection.getDB().collection("users").createIndex({"FirstName": 1}, {name: "firstname", unique: true});

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
        await app.post("/api/users/register")
          .send({
            userName: testUser.UserName,
            email: testUser.Email,
            password: testUser.Password,
            firstName: testUser.FirstName,
            lastName: testUser.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");

          });
      });

    mongoConnection.getDB().collection("users").dropIndex("firstname");
  });
});

describe("/api/users/register/rpi", () => {

  it("GET: register rpi success", async() => {
    let res = await createUser();
    session = { cas_return_to: "", cas_user: "mcdanz", userData: { userID: res.insertedId } };
    await app.get("/api/users/register/rpi")
      .send({
        userName: testUser.UserName,
        email: testUser.Email,
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(302);
  });

  it("POST: register rpi success", async() => {
    let res = await createUser();
    session = { userDataTemp: { userName: testUser.UserName + "2", email: testUser.Email + "2" } };
    await app.post("/api/users/register/rpi")
      .send({
        userName: testUser.UserName + "2",
        email: testUser.Email + "2",
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName + "2");

        let res = await mongoConnection.getDB().collection("users").findOne({ 
          UserName: testUser.UserName + "2",
          Email: testUser.Email + "2",
          FirstName: testUser.FirstName,
          LastName: testUser.LastName,
          SchoolAffiliation: "RPI"
        });


        expect(res).toBeTruthy();
        expect(session.userData.userID).toBe(res._id.toString());
      });
  });

  it("POST: register rpi name failure", async() => {
    let res = await createUser();
    session = { userDataTemp: { userName: testUser.UserName, email: testUser.Email } };
    await app.post("/api/users/register/rpi")
      .send({
        userName: testUser.UserName,
        email: testUser.Email,
        password: testUser.Password,
        firstName: "",
        lastName: 2
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: register rpi failure duplicate", async () => {
    
    // Create unique indexes
    mongoConnection.getDB().collection("users").createIndex({"UserName": 1}, {unique: true});
    session = { userDataTemp: { userName: testUser.UserName + "3", email: testUser.Email + "3" } };

    await app.post("/api/users/register/rpi")
      .send({
        userName: testUser.UserName + "3",
        email: testUser.Email + "3",
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(200)
      .then(async (response) => {
        session = { userDataTemp: { userName: testUser.UserName + "3", email: testUser.Email + "3" } };

        await app.post("/api/users/register/rpi")
          .send({
            userName: testUser.UserName + "3",
            email: testUser.Email + "3",
            password: testUser.Password,
            firstName: testUser.FirstName,
            lastName: testUser.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");

          });
      });
  });

  it("POST: register temp data failure", async() => {
    let res = await createUser();
    session = { };
    await app.post("/api/users/register/rpi")
      .send({
        userName: testUser.UserName,
        email: testUser.Email,
        password: testUser.Password,
        firstName: testUser.FirstName,
        lastName: testUser.LastName
      })
      .expect(500)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/users/logout", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/users/logout")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: logout user success", async () => {
    session = { userData: {} };
    await app.post("/api/users/logout")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(session).not.toHaveProperty("userData");
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
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName);
        expect(response.body.data.email).toBe(testUser.Email);
      });    
  });

  it("GET: user not logged in", async () => {
    await app.get("/api/users/me")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/users/me")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });
});

describe("/api/users/me/edit", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/users/me/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: update user data all unlocked", async () => {
    let res = await createUser({
      UserNameLocked: false,
      FirstNameLocked: false,
      LastNameLocked: false,
      EmailLocked: false,
      SchoolAffiliation: "",
    });
    session = { userData: { userID: res.insertedId } };
    await app.post("/api/users/me/edit")
      .send({
        firstName: testUser2.FirstName,
        lastName: testUser2.LastName,
        userName: testUser2.UserName,
        email: testUser2.Email,
        password: testUser2.Password,
        logOutEverywhere: false,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser2.FirstName);
        expect(response.body.data.lastName).toBe(testUser2.LastName);
        expect(response.body.data.userName).toBe(testUser2.UserName);
        expect(response.body.data.email).toBe(testUser2.Email);

        let updatedUser = await mongoConnection.getDB().collection("users").findOne({ 
          _id: res.insertedId,
        });
        
        expect(updatedUser.FirstName).toBe(testUser2.FirstName);
        expect(updatedUser.LastName).toBe(testUser2.LastName);
        expect(updatedUser.UserName).toBe(testUser2.UserName);
        expect(updatedUser.Email).toBe(testUser2.Email);
        expect(bcrypt.compareSync(testUser2.Password, updatedUser.Password)).toBe(true);
      });    
  });

  it("POST: update user data all locked", async () => {
    let res = await createUser({
      UserNameLocked: true,
      FirstNameLocked: true,
      LastNameLocked: true,
      EmailLocked: true,
      SchoolAffiliation: "RPI",
    });
    session = { userData: { userID: res.insertedId } };
    await app.post("/api/users/me/edit")
      .send({
        firstName: testUser2.FirstName,
        lastName: testUser2.LastName,
        userName: testUser2.UserName,
        email: testUser2.Email,
        password: testUser2.Password,
        logOutEverywhere: false,
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: logOutEverywhere not included with password", async () => {
    let res = await createUser({
      SchoolAffiliation: "",
    });
    session = { userData: { userID: res.insertedId } };
    await app.post("/api/users/me/edit")
      .send({
        password: testUser2.Password,
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: user not logged in failed", async () => {
    await app.post("/api/users/me/edit")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

});

describe("/api/users/me/groups", () => {

  //TODO: Successfully gets user groups. Issue#591

  it.skip("GET: user groups success", async () => {
    let res = await createUser();
    session = { userData: {userID: "1" } };
    await app.get("/api/users/me/groups")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
      });    
  });

  it("GET: user not logged in failed", async () => {
    await app.get("/api/users/me/groups")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: route unavailable", async () => {
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
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.userName).toBe(testUser.UserName);
        expect(response.body.data.email).toBe(testUser.Email);
      });    
  });

  it("GET: invalid userID", async () => {
    await app.get("/api/users/0")
      .expect(400)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/users/0")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/users/:id/edit", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/users/0/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: update user data all unlocked", async () => {
    let res = await createUser({
      UserNameLocked: false,
      FirstNameLocked: false,
      LastNameLocked: false,
      EmailLocked: false,
      SchoolAffiliation: "",
    });
    await app.post("/api/users/" + res.insertedId + "/edit")
      .send({
        firstName: testUser2.FirstName,
        lastName: testUser2.LastName,
        userName: testUser2.UserName,
        email: testUser2.Email,
        password: testUser2.Password,
        logOutEverywhere: false,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser2.FirstName);
        expect(response.body.data.lastName).toBe(testUser2.LastName);
        expect(response.body.data.userName).toBe(testUser2.UserName);
        expect(response.body.data.email).toBe(testUser2.Email);

        let updatedUser = await mongoConnection.getDB().collection("users").findOne({ 
          _id: res.insertedId,
        });
        
        expect(updatedUser.FirstName).toBe(testUser2.FirstName);
        expect(updatedUser.LastName).toBe(testUser2.LastName);
        expect(updatedUser.UserName).toBe(testUser2.UserName);
        expect(updatedUser.Email).toBe(testUser2.Email);
        expect(bcrypt.compareSync(testUser2.Password, updatedUser.Password)).toBe(true);
      });    
  });

  it("POST: update user data all locked", async () => {
    let res = await createUser({
      UserNameLocked: true,
      FirstNameLocked: true,
      LastNameLocked: true,
      EmailLocked: true,
      SchoolAffiliation: "RPI",
    });
    await app.post("/api/users/" + res.insertedId + "/edit")
      .send({
        firstName: testUser2.FirstName,
        lastName: testUser2.LastName,
        userName: testUser2.UserName,
        email: testUser2.Email,
        password: testUser2.Password,
        logOutEverywhere: false,
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });    
  });

  it("POST: logOutEverywhere not included with password", async () => {
    let res = await createUser({
      SchoolAffiliation: "",
    });
    session = { userData: { userID: res.insertedId } };
    await app.post("/api/users/" + res.insertedId + "/edit")
      .send({
        password: testUser2.Password,
      })
      .expect(400)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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

  //TODO: Successfully gets user groups Issue#591

  it("GET: invalid userID", async () => {
    await app.get("/api/users/0/groups")
      .expect(400)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/users/0/groups")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});