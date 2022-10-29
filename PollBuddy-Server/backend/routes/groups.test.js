require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const mongoConnection = require("../modules/mongoConnection.js");
const groupsRouter = require("./groups");
const {
  testUser,
  testGroup,
  createUser,
  createGroup,
  createPoll,
  testPoll,
  testGroup2
} = require("../modules/testingUtils");

let mockApp = express();
let session = {};

mockApp.use(express.json());
mockApp.use(express.urlencoded({extended: false}));
// eslint-disable-next-line no-unused-vars
mockApp.use(function (req, res, next) {
  req.session = session;
  next();
});
mockApp.use("/api/groups", groupsRouter);

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

describe("/api/groups/:id", () => {

  it("GET: get group as non-member", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = {userData: {userID: user.insertedId}};
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
    let group = await createGroup({Members: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
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
    let group = await createGroup({Admins: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
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
    session = {userData: {userID: user.insertedId}};
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
    session = {userData: {userID: user.insertedId}};
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

  it("POST: non-admin edit group", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/edit")
      .expect(404)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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
    session = {userData: {userID: user.insertedId}};
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
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/admins")
      .expect(404)
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

describe("/api/groups/:id/members", () => {

  it("GET: get group members", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId], Members: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/members")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data[0].id.toString()).toEqual(user.insertedId.toString());
        expect(response.body.data[0].userName.toString()).toEqual(testUser.UserName);
      });
  });

  it("GET: non-admin get group members", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/members")
      .expect(404)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0/members")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/groups/:id/polls", () => {

  it("GET: get group polls as admin", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId]});
    // Poll not open
    let poll1 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() + (24 * 60 * 60 * 1000),
      CloseTime: Date.now() + (24 * 60 * 60 * 1000)
    });
    // Poll currently open
    let poll2 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() - (24 * 60 * 60 * 1000),
      CloseTime: Date.now() + (24 * 60 * 60 * 1000)
    });
    // Poll already closed
    let poll3 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() - (24 * 60 * 60 * 1000),
      CloseTime: Date.now() - (24 * 60 * 60 * 1000)
    });
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/polls")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        // Admins should be able to retrieve all polls.
        expect(response.body.data[0].id.toString()).toEqual(poll1.insertedId.toString());
        expect(response.body.data[0].title).toEqual(testPoll.Title);

        expect(response.body.data[1].id.toString()).toEqual(poll2.insertedId.toString());
        expect(response.body.data[1].title).toEqual(testPoll.Title);

        expect(response.body.data[2].id.toString()).toEqual(poll3.insertedId.toString());
        expect(response.body.data[2].title).toEqual(testPoll.Title);
      });
  });

  it("GET: get group polls as member", async () => {
    let user = await createUser();
    let group = await createGroup({Members: [user.insertedId]});
    // Poll not open
    let poll1 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() + (24 * 60 * 60 * 1000),
      CloseTime: Date.now() + (24 * 60 * 60 * 1000)
    });
    // Poll currently open
    let poll2 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() - (24 * 60 * 60 * 1000),
      CloseTime: Date.now() + (24 * 60 * 60 * 1000)
    });
    // Poll already closed
    let poll3 = await createPoll({
      Group: group.insertedId,
      OpenTime: Date.now() - (24 * 60 * 60 * 1000),
      CloseTime: Date.now() - (24 * 60 * 60 * 1000)
    });
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/polls")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        // Members should only be able to retrieve currently open polls.
        expect(response.body.data[0].id.toString()).toEqual(poll2.insertedId.toString());
        expect(response.body.data[0].title).toEqual(testPoll.Title);
      });
  });

  it("GET: get polls as non-member", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = {userData: {userID: user.insertedId}};
    await app.get("/api/groups/" + group.insertedId + "/polls")
      .expect(403)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/groups/0/members")
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
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/join")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(res.Members).toHaveLength(1);
        expect(res.Members[0].toString()).toEqual(user.insertedId.toString());
      });
  });

  it("POST: join group as user", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/join")
      .expect(404)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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
    let group = await createGroup({Members: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/leave")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(res.Members).toHaveLength(0);
      });
  });

  it("POST: join group as group member", async () => {
    let user = await createUser();
    let group = await createGroup({Admins: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/join")
      .expect(404)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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
    let group = await createGroup({Admins: [user.insertedId]});
    session = {userData: {userID: user.insertedId}};
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
    session = {userData: {userID: user.insertedId}};
    await app.post("/api/groups/" + group.insertedId + "/delete")
      .expect(404)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});
