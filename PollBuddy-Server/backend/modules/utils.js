const mongoConnection = require("../modules/mongoConnection.js");


// Helper function for creating specified http response (https://pollbuddy.app/api/users)
// error and data are optional
function createResponse(isSuccess = true, error, data) {
  const payload = {
    result: isSuccess ? "success" : "failure"
  };
  if (error) {
    payload.error = error;
  }
  if (data) {
    payload.data = data;
  }
  return payload;
}

// Check if ID exists for a specific Collection
// returns objectID if valid or null if nothing is found.
async function validateID(collection, id) {
  try {
    const objId = new mongoConnection.getMongo().ObjectID(id)
    await mongoConnection.getDB().collection(collection) // find id cursor
      .find({_id: objId}, {limit: 1});
    return objId;  // exists
  } catch (e) {
    return null; // doesn't exists
  }
}

module.exports = {
  createResponse,
  validateID
};