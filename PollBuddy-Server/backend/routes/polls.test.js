require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var mongoConnection = require("../modules/mongoConnection.js");
var pollsRouter = require("./pollsNew");

var { testUser, testUser2, testGroup, createUser, createGroup } = require("../modules/testingUtils.js");
const {createPoll, testPoll, testPoll2} = require("../modules/testingUtils");
const bson = require("bson");

let mockApp = express();
let session = {};

mockApp.use(express.json());
mockApp.use(express.urlencoded({ extended: false }));
mockApp.use(function (req, res, next) {
  req.session = session;
  next();
});
mockApp.use("/api/polls", pollsRouter);

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

describe("/api/groups/:pollID", () => {

  it("GET: get poll as non-member", async () => {
    let user = await createUser();
    let group = await createGroup();
    let poll = await createPoll(group.insertedId);
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("GET: get poll as member", async () => {
    let user = await createUser();
    let group = await createGroup({ Users: [ user.insertedId ] });
    let poll = await createPoll(group.insertedId);
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.title).toEqual(testPoll.Title);
        expect(response.body.data.description).toEqual(testPoll.Description);
      });
  });

  it("GET: get poll as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll(group.insertedId);
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.title).toEqual(testPoll.Title);
        expect(response.body.data.description).toEqual(testPoll.Description);
      });
  });

  it("POST: route unavailable", async () => {
    await app.post("/api/polls/0")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});


describe("/api/polls/new", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/polls/new")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: create poll", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/new")
      .send({
        title: testPoll.Title,
        description: testPoll.Description,
        group: group.insertedId,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let poll = await mongoConnection.getDB().collection("polls").findOne({
          _id: new bson.ObjectID(response.body.data.id),
        });
        expect(poll.Title).toEqual(testPoll.Title);
        expect(poll.Description).toEqual(testPoll.Description);
        expect(poll.Group.toString()).toEqual(group.insertedId.toString());
        let updatedGroup = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId,
        });
        expect(updatedGroup.Polls[0].toString()).toEqual(poll._id.toString());
      });
  });

});

describe("/api/polls/:pollID/edit", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/polls/0/edit")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: edit poll", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll(group.insertedId);
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/edit")
      .send({
        title: testPoll2.Title,
        description: testPoll2.Description,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("polls").findOne({
          _id: poll.insertedId,
        });
        expect(res.Title).toEqual(testPoll2.Title);
        expect(res.Description).toEqual(testPoll2.Description);
      });
  });

});
