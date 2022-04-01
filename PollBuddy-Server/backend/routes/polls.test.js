require("dotenv").config();
const express = require("express");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

var mongoConnection = require("../modules/mongoConnection.js");
var pollsRouter = require("./polls");

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

  it("GET: get group poll as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.title).toEqual(testPoll.Title);
        expect(response.body.data.description).toEqual(testPoll.Description);
        expect(response.body.data.allowSubmissions).toEqual(false);
      });
  });

  it("GET: get non-group poll as creator", async () => {
    let user = await createUser();
    let poll = await createPoll({ Creator: user.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.title).toEqual(testPoll.Title);
        expect(response.body.data.description).toEqual(testPoll.Description);
        expect(response.body.data.allowSubmissions).toEqual(false);
      });
  });

  it("GET: get visible group poll as member", async () => {
    let user = await createUser();
    let group = await createGroup({ Members: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId, AllowSubmissions: true });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        expect(response.body.data.title).toEqual(testPoll.Title);
        expect(response.body.data.description).toEqual(testPoll.Description);
      });
  });

  it("GET: get non-visible group poll as member, failure", async () => {
    let user = await createUser();
    let group = await createGroup({ Members: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId, AllowSubmissions: false });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(403)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("GET: get visible group poll as non member, failure", async () => {
    let user = await createUser();
    let group = await createGroup();
    let poll = await createPoll({ Group: group.insertedId, AllowSubmissions: true });
    session = { userData: { userID: user.insertedId } };
    await app.get("/api/polls/" + poll.insertedId)
      .expect(403)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("GET: get visible public poll as not logged in", async () => {
    let poll = await createPoll({ Creator: new bson.ObjectID(), AllowSubmissions: true, RequiresLogin: false });
    await app.get("/api/polls/" + poll.insertedId)
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
      });
  });

  it("GET: get visible non public poll as not logged in", async () => {
    let poll = await createPoll({ Creator: new bson.ObjectID(), AllowSubmissions: true, RequiresLogin: true });
    await app.get("/api/polls/" + poll.insertedId)
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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


describe("/api/polls/:id/results", () => {
  
  it("POST: route unavailable", async () => {
    await app.post("/api/polls/0/results")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      })
  });

  it("GET: results success", async () => {
    //let user = await createUser();
    //let group = await createGroup({ Admins: [ user.insertedId ] });
    //let poll = await createPoll({ Group: group.insertedId });
    //session = { userData: { userID: user.insertedId } };

    let user = await createUser();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/new")
      .send({
        title: testPoll.Title,
        description: testPoll.Description,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        poll_id = response.body.data.id;
        console.log(response.body.data)

    await app.post("/api/polls/" + poll_id + "/createQuestion")
      .send({
        text: "sample.question",
        answers: [{ text: "sample.answer", correct: true }],
        maxAllowedChoices: 1,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let questionRes = await mongoConnection.getDB().collection("polls").findOne({
          "_id": poll_id,
          "Questions._id": new bson.ObjectID(response.body.data.id),
        });
        console.log(questionRes)
        //expect(questionRes).not.toBeNull();

        await app.get("/api/polls/" + poll_id + "/results")
          .expect(200)
          .then(async (response) => {
            expect(response.body.result).toBe("success");
            expect(response.body.data.title).toBe(testPoll.Title);
            expect(response.body.data.description).toBe(testPoll.Description);
          });
      });
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

  it("POST: create group poll", async () => {
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
        expect(poll.Creator).toEqual(false);
        let updatedGroup = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId,
        });
        expect(updatedGroup.Polls[0].toString()).toEqual(poll._id.toString());
      });
  });

  it("POST: create non-group poll", async () => {
    let user = await createUser();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/new")
      .send({
        title: testPoll.Title,
        description: testPoll.Description,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let poll = await mongoConnection.getDB().collection("polls").findOne({
          _id: new bson.ObjectID(response.body.data.id),
        });
        expect(poll.Title).toEqual(testPoll.Title);
        expect(poll.Description).toEqual(testPoll.Description);
        expect(poll.Creator.toString()).toEqual(user.insertedId.toString());
        expect(poll.Group).toEqual(false);
      });
  });

  it("POST: create group poll as non-admin, failure", async () => {
    let user = await createUser();
    let group = await createGroup();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/new")
      .send({
        title: testPoll.Title,
        description: testPoll.Description,
        group: group.insertedId,
      })
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
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

  it("POST: edit group poll as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/edit")
      .send({
        title: testPoll2.Title,
        description: testPoll2.Description,
        allowSubmissions: true,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("polls").findOne({
          _id: poll.insertedId,
        });
        expect(res.Title).toEqual(testPoll2.Title);
        expect(res.Description).toEqual(testPoll2.Description);
        expect(res.AllowSubmissions).toEqual(true);
      });
  });

  it("POST: edit non-group poll as creator", async () => {
    let user = await createUser();
    let poll = await createPoll({ Creator: user.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/edit")
      .send({
        title: testPoll2.Title,
        description: testPoll2.Description,
        allowSubmissions: true,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let res = await mongoConnection.getDB().collection("polls").findOne({
          _id: poll.insertedId,
        });
        expect(res.Title).toEqual(testPoll2.Title);
        expect(res.Description).toEqual(testPoll2.Description);
        expect(res.AllowSubmissions).toEqual(true);
      });
  });

  it("POST: edit poll as non-admin", async () => {
    let user = await createUser();
    let poll = await createPoll();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/edit")
      .send({
        title: testPoll2.Title,
        description: testPoll2.Description,
        allowSubmissions: true,
      })
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/polls/:pollID/delete", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/polls/0/delete")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: delete group poll as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/delete")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        let pollRes = await mongoConnection.getDB().collection("polls").findOne({
          _id: poll.insertedId,
        });
        expect(pollRes).toBeNull();

        let groupRes = await mongoConnection.getDB().collection("groups").findOne({
          _id: group.insertedId
        });
        expect(groupRes.Polls).toHaveLength(0);
      });
  });

  it("POST: delete non-group poll as admin", async () => {
    let user = await createUser();
    let poll = await createPoll({ Creator: user.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/delete")
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");

        let pollRes = await mongoConnection.getDB().collection("polls").findOne({
          _id: poll.insertedId,
        });
        expect(pollRes).toBeNull();
      });
  });

  it("POST: delete non-group poll as admin, failure", async () => {
    let user = await createUser();
    let poll = await createPoll();
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/delete")
      .expect(401)
      .then(async (response) => {
        expect(response.body.result).toBe("failure");
      });
  });

});

describe("/api/polls/:pollID/createQuestion", () => {

  it("GET: route unavailable", async () => {
    await app.get("/api/polls/0/createQuestion")
      .expect(405)
      .then((response) => {
        expect(response.body.result).toBe("failure");
      });
  });

  it("POST: create question as admin", async () => {
    let user = await createUser();
    let group = await createGroup({ Admins: [ user.insertedId ] });
    let poll = await createPoll({ Group: group.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/createQuestion")
      .send({
        text: "sample.question",
        answers: [{ text: "sample.answer", correct: true }],
        maxAllowedChoices: 1,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let questionRes = await mongoConnection.getDB().collection("polls").findOne({
          "_id": poll.insertedId,
          "Questions._id": new bson.ObjectID(response.body.data.id),
        });
        expect(questionRes).not.toBeNull();
      });
  });

  it("POST: create question as poll creator", async () => {
    let user = await createUser();
    let poll = await createPoll({ Creator: user.insertedId });
    session = { userData: { userID: user.insertedId } };
    await app.post("/api/polls/" + poll.insertedId + "/createQuestion")
      .send({
        text: "sample.question",
        answers: [{ text: "sample.answer", correct: true }],
        maxAllowedChoices: 1,
      })
      .expect(200)
      .then(async (response) => {
        expect(response.body.result).toBe("success");
        let questionRes = await mongoConnection.getDB().collection("polls").findOne({
          "_id": poll.insertedId,
          "Questions._id": new bson.ObjectID(response.body.data.id),
        });
        expect(questionRes).not.toBeNull();
      });
  });

});
