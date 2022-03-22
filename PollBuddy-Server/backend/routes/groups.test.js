require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var { groupSchema } = require("../models/Group.js");
var { userSchema } = require("../models/User.js");
var { createModel } = require("../modules/utils.js");
var mongoConnection = require("../modules/mongoConnection.js");
var groupsRouter = require("./groups");
const {testUser, testUser2, testGroup, createUser, createGroup, createPoll, testPoll, testGroup2} = require("../modules/testingUtils");
const {create} = require("connect-mongo");
const bson = require("bson");

let mockApp = express();
let session = {};

mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: false }));
mockApp.use(function (req, res, next) {
  req.session = session;
  next();
});
mockApp.use("/api/groups", groupsRouter);

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

describe("/api/groups/:id", () => {

  it("GET: get group as non-member", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.name).toBe(testGroup.Name);
        expect(response.body.data.isAdmin).toBe(false);
        expect(response.body.data.isMember).toBe(false);
      });
  });

  it("GET: get group as member", async () => {
    let user = await createUser();
    let group = await createGroup({ Users: [ user.insertedId ] });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.name).toBe(testGroup.Name);
        expect(response.body.data.isAdmin).toBe(false);
        expect(response.body.data.isMember).toBe(true);
      });
  });

  it("GET: get group as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.name).toBe(testGroup.Name);
        expect(response.body.data.isAdmin).toBe(true);
        expect(response.body.data.isMember).toBe(false);
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/new", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/groups/new")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: create group", async () => {
    let user = await createUser();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/new")
      .send({
        name: testGroup.Name,
        description: testGroup.Description,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          Name: testGroup.Name,
          Description: testGroup.Description,
        });
        expect(res).toBeTruthy();
        expect(response.body.data.id.toString()).toEqual(res._id.toString());
        expect(res.Admins[0].toString()).toEqual(user.insertedId.toString());
      });
  });

  it("POST: create group, user not logged in", async () => {
    await app.post("/api/groups/new")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/edit", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/groups/0/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: edit group", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId]});
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/" + group.insertedId + "/edit")
      .send({
        name: testGroup2.Name,
        description: testGroup2.Description,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId,
        });
        expect(res.Name).toEqual(testGroup2.Name);
        expect(res.Description).toEqual(testGroup2.Description);
      });
  });

  it("POST: edit group, user not logged in", async () => {
    await app.post("/api/groups/0/edit")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/admins", () => {

  it("GET: get group admins", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId]});
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId + "/admins")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0].id.toString()).toEqual(user.insertedId.toString());
        expect(response.body.data[0].userName.toString()).toEqual(testUser.UserName);
      });
  });

  it("GET: non-admin get group admins", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId + "/admins")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0/admins")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/users", () => {

  it("GET: get group users", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId], Users: [user.insertedId]});
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId + "/users")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0].id.toString()).toEqual(user.insertedId.toString());
        expect(response.body.data[0].userName.toString()).toEqual(testUser.UserName);
      });
  });

  it("GET: non-admin get group users", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId + "/users")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0/users")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/polls", () => {

  it("GET: get group polls", async () => {
    let user = await createUser();
    let group = await createGroup();
    let poll = await createPoll({ Group: group.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/groups/" + group.insertedId + "/polls")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0].id.toString()).toEqual(poll.insertedId.toString());
        expect(response.body.data[0].title).toEqual(testPoll.Title);
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0/users")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/join", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/groups/0/join")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: join group", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/" + group.insertedId + "/join")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(res.Users).toHaveLength(1);
        expect(res.Users[0].toString()).toEqual(user.insertedId.toString());
      });
  });

});

describe("/api/groups/:id/leave", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/groups/0/leave")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: leave group", async () => {
    let user = await createUser();
    let group = await createGroup({ Users: [user.insertedId] });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/" + group.insertedId + "/leave")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(res.Users).toHaveLength(0);
      });
  });

});

describe("/api/groups/:id/delete", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/groups/0/delete")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: delete group", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [user.insertedId] });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/" + group.insertedId + "/delete")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(res).toBeNull();
      });
  });

  it("POST: non-admin delete group", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/groups/" + group.insertedId + "/delete")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});
