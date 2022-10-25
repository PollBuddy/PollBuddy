require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const {userSchema} = require("../models/User.js");
const {createModel} = require("../modules/utils.js");
const mongoConnection = require("../modules/mongoConnection.js");
const usersRouter = require("./users");
const {testUser, testUser2, testGroup, createUser, createGroup} = require("../modules/testingUtils.js");
const {testGroup2} = require("../modules/testingUtils");

let mockApp = express();
let session = {};

mockApp.use(express.json());
mockApp.use(express.urlencoded({extended: false}));
// eslint-disable-next-line no-unused-vars
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

beforeEach(async () => {
  session = {};

  let collections = await mongoConnection.getDB().listCollections().toArray();
  collections.forEach(async (collection) => {
    await mongoConnection.getDB().collection(collection.name).deleteMany({});
  });
});

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
    await createUser();
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

  it("POST: login with school affiliation failure", async () => {
    await createUser({SchoolAffiliation: "RPI"});
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

  it("POST: login with password failure", async () => {
    await createUser();
    let userLogin = {
      userNameEmail: testUser.Email,
      password: "",
    };

    await app.post("/api/users/login",)
      .send(userLogin)
      .expect(401)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: login with email failure, no user found", async () => {
    await createUser();
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
    await createUser();
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
//
//
//
// describe("/api/users/login/rpi", () => {
//
//   it("POST: route unavailable", async() => {
//     await app.post("/api/users/login/rpi")
//       .expect(405)
//       .then((response) => {
//         expect(response.body.result).toBe("failure");
//       });
//   });
//
//   it("GET requests login rpi failure", async () => {
//     let res = await createUser();
//     // eslint-disable-next-line camelcase
//     session = { cas_user: "notregistereduser", userData: { userID: res.insertedId } };
//     await app.get("/api/users/login/rpi")
//       .expect(302)
//       .then(async () => {});
//   });
//
//   it("GET requests login rpi success", async () => {
//     await createUser();
//     session = { userDataTemp: { userName: "__rpi_" + testUser.UserName, email: testUser.Email } };
//     await app.post("/api/users/register/rpi")
//       .send({
//         userName: "__rpi_" + testUser.UserName,
//         email: testUser.Email,
//         password: testUser.Password,
//         firstName: testUser.FirstName,
//         lastName: testUser.LastName
//       })
//       .expect(200).then(async (response) => {
//         expect(response.body.result).toBe("success");
//         expect(response.body.data.firstName).toBe(testUser.FirstName);
//         expect(response.body.data.lastName).toBe(testUser.LastName);
//         expect(response.body.data.userName).toBe("__rpi_" + testUser.UserName);
//
//         // eslint-disable-next-line camelcase
//         session = { cas_user: testUser.UserName, userData: { userID: session.userData.userID } };
//
//         await app.get("/api/users/login/rpi")
//           .expect(302);
//       });
//   });
//
// });
//
//
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
      .then(async () => {
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
      .then(async () => {
        await app.post("/api/users/register")
          .send({
            userName: testUser.UserName,
            email: testUser2.Email,
            password: testUser2.Password,
            firstName: testUser2.FirstName,
            lastName: testUser2.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");

          });
      });

    mongoConnection.getDB().collection("users").dropIndex("username");
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
      .then(async () => {
        await app.post("/api/users/register")
          .send({
            userName: testUser2.UserName,
            email: testUser.Email,
            password: testUser2.Password,
            firstName: testUser2.FirstName,
            lastName: testUser2.LastName,
          })
          .expect(400)
          .then(async (response) => {
            expect(response.body.result).toBe("failure");
          });
      });

    mongoConnection.getDB().collection("users").dropIndex("email");
  });
});

// describe("/api/users/register/rpi", () => {
//
//   it("GET: register rpi success", async () => {
//     let res = await createUser();
//     // eslint-disable-next-line camelcase
//     session = {cas_return_to: "", cas_user: "mcdanz", userData: {userID: res.insertedId}};
//     await app.get("/api/users/register/rpi")
//       .send({
//         userName: testUser.UserName,
//         email: testUser.Email,
//         password: testUser.Password,
//         firstName: testUser.FirstName,
//         lastName: testUser.LastName
//       })
//       .expect(302);
//   });
//
//   it("POST: register rpi success", async () => {
//     await createUser();
//     session = {userDataTemp: {userName: testUser.UserName + "2", email: testUser.Email + "2"}};
//     await app.post("/api/users/register/rpi")
//       .send({
//         userName: testUser.UserName + "2",
//         email: testUser.Email + "2",
//         password: testUser.Password,
//         firstName: testUser.FirstName,
//         lastName: testUser.LastName
//       })
//       .expect(200)
//       .then(async (response) => {
//         expect(response.body.result).toBe("success");
//         expect(response.body.data.firstName).toBe(testUser.FirstName);
//         expect(response.body.data.lastName).toBe(testUser.LastName);
//         expect(response.body.data.userName).toBe(testUser.UserName + "2");
//
//         let res = await mongoConnection.getDB().collection("users").findOne({
//           UserName: testUser.UserName + "2",
//           Email: testUser.Email + "2",
//           FirstName: testUser.FirstName,
//           LastName: testUser.LastName,
//           SchoolAffiliation: "RPI"
//         });
//
//         expect(res).toBeTruthy();
//         expect(session.userData.userID).toBe(res._id.toString());
//       });
//   });
//
//   it("POST: register rpi name failure", async () => {
//     await createUser();
//     session = {userDataTemp: {userName: testUser.UserName, email: testUser.Email}};
//     await app.post("/api/users/register/rpi")
//       .send({
//         userName: testUser.UserName,
//         email: testUser.Email,
//         password: testUser.Password,
//         firstName: "",
//         lastName: 2
//       })
//       .expect(400)
//       .then(async (response) => {
//         expect(response.body.result).toBe("failure");
//       });
//   });
//
//   it("POST: register rpi failure duplicate", async () => {
//
//     // Create unique indexes
//     mongoConnection.getDB().collection("users").createIndex({"UserName": 1}, {unique: true});
//     session = {userDataTemp: {userName: testUser.UserName + "3", email: testUser.Email + "3"}};
//
//     await app.post("/api/users/register/rpi")
//       .send({
//         userName: testUser.UserName + "3",
//         email: testUser.Email + "3",
//         password: testUser.Password,
//         firstName: testUser.FirstName,
//         lastName: testUser.LastName
//       })
//       .expect(200)
//       .then(async () => {
//         session = {userDataTemp: {userName: testUser.UserName + "3", email: testUser.Email + "3"}};
//
//         await app.post("/api/users/register/rpi")
//           .send({
//             userName: testUser.UserName + "3",
//             email: testUser.Email + "3",
//             password: testUser.Password,
//             firstName: testUser.FirstName,
//             lastName: testUser.LastName,
//           })
//           .expect(400)
//           .then(async (response) => {
//             expect(response.body.result).toBe("failure");
//
//           });
//       });
//   });
//
//   it("POST: register temp data failure", async () => {
//     await createUser();
//     session = {};
//     await app.post("/api/users/register/rpi")
//       .send({
//         userName: testUser.UserName,
//         email: testUser.Email,
//         password: testUser.Password,
//         firstName: testUser.FirstName,
//         lastName: testUser.LastName
//       })
//       .expect(500)
//       .then(async (response) => {
//         expect(response.body.result).toBe("failure");
//       });
//   });
//
// });

describe("/api/users/logout", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/users/logout")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: logout user success", async () => {
    session = {userData: {}};
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
    session = {userData: {userID: res.insertedId}};
    await app.get("/api/users/me")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.firstName).toBe(testUser.FirstName);
        expect(response.body.data.firstNameLocked).toBe(testUser.FirstNameLocked);
        expect(response.body.data.lastName).toBe(testUser.LastName);
        expect(response.body.data.lastNameLocked).toBe(testUser.LastNameLocked);
        expect(response.body.data.userName).toBe(testUser.UserName);
        expect(response.body.data.userNameLocked).toBe(testUser.UserNameLocked);
        expect(response.body.data.email).toBe(testUser.Email);
        expect(response.body.data.emailLocked).toBe(testUser.EmailLocked);
        expect(response.body.data.schoolAffiliation).toBe(testUser.SchoolAffiliation);
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
    session = {userData: {userID: res.insertedId}};
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
    session = {userData: {userID: res.insertedId}};
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
    session = {userData: {userID: res.insertedId}};
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

  it("GET: get user groups", async () => {
    let user = await createUser();
    let adminGroup = await createGroup({Admins: [user.insertedId.toString()]});
    let memberGroup = await createGroup({Name: testGroup2.Name, Members: [user.insertedId.toString()]});
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/users/me/groups")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.admin[0].id.toString()).toEqual(adminGroup.insertedId.toString());
        expect(response.body.data.admin[0].name).toEqual(testGroup.Name);
        expect(response.body.data.member[0].id.toString()).toEqual(memberGroup.insertedId.toString());
        expect(response.body.data.member[0].name).toEqual(testGroup2.Name);
      });
  });

  it.skip("GET: user groups success", async () => {
    await createUser();
    session = {userData: {userID: "1"}};
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
    session = {userData: {userID: res.insertedId}};
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
  it("GET: get user groups", async () => {
    let user = await createUser();
    let adminGroup = await createGroup({Admins: [user.insertedId.toString()]});
    let memberGroup = await createGroup({Name: testGroup2.Name, Members: [user.insertedId.toString()]});
    await app.get("/api/users/" + user.insertedId + "/groups")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.admin[0].id.toString()).toEqual(adminGroup.insertedId.toString());
        expect(response.body.data.admin[0].name).toEqual(testGroup.Name);
        expect(response.body.data.member[0].id.toString()).toEqual(memberGroup.insertedId.toString());
        expect(response.body.data.member[0].name).toEqual(testGroup2.Name);
      });
  });

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

describe("/me/polls", () => {
  it("GET: route unavailable", async () => {
    await app.get("/me/polls")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("GET: get group polls as creator", async () => {
    let user = await createUser();
    session = {userData: {userID: user.insertedId}};
    let poll1 = await createPoll();
    let poll2 = await createPoll();
    let poll3 = await createPoll();
    await app.get("/me/polls")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        expect(response.body.data[0].id.toString()).toEqual(poll1.insertedId.toString());
        expect(response.body.data[0].title).toEqual(testPoll.Title);

        expect(response.body.data[1].id.toString()).toEqual(poll2.insertedId.toString());
        expect(response.body.data[1].title).toEqual(testPoll.Title);

        expect(response.body.data[2].id.toString()).toEqual(poll3.insertedId.toString());
        expect(response.body.data[2].title).toEqual(testPoll.Title);
      });
  });

});