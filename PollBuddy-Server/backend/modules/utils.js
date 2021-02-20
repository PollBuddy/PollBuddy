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

module.exports = {
  createResponse
};