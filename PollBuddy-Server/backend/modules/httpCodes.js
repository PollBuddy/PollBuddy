const HTTP_CODES = [
  {
    statusCode: 200,
    status: "Ok",
  },
  {
    statusCode: 400,
    status: "BadRequest",
  },
  {
    statusCode: 401,
    status: "Unauthorized",
  },
  {
    statusCode: 402,
    status: "PaymentRequired",
  },
  {
    statusCode: 403,
    status: "Forbidden",
  },
  {
    statusCode: 404,
    status: "NotFound",
  },
  {
    statusCode: 405,
    status: "MethodNotAllowed",
  },
  {
    statusCode: 406,
    status: "NotAcceptable",
  },
  {
    statusCode: 407,
    status: "ProxyAuthenticationRequired",
  },
  {
    statusCode: 408,
    status: "RequestTimeout",
  },
  {
    statusCode: 409,
    status: "Conflict",
  },
  {
    statusCode: 410,
    status: "Gone",
  },
  {
    statusCode: 411,
    status: "LengthRequired",
  },
  {
    statusCode: 412,
    status: "PreconditionFailed",
  },
  {
    statusCode: 413,
    status: "PayloadTooLarge",
  },
  {
    statusCode: 414,
    status: "URITooLong",
  },
  {
    statusCode: 415,
    status: "UnsupportedMediaType",
  },
  {
    statusCode: 416,
    status: "RangeNotSatisfiable",
  },
  {
    statusCode: 417,
    status: "ExpectationFailed",
  },
  {
    statusCode: 418,
    status: "ImATeapot",
  },
  {
    statusCode: 421,
    status: "MisdirectedRequest",
  },
  {
    statusCode: 422,
    status: "UnprocessableEntity",
  },
  {
    statusCode: 423,
    status: "Locked",
  },
  {
    statusCode: 424,
    status: "FailedDependency",
  },
  {
    statusCode: 425,
    status: "TooEarly",
  },
  {
    statusCode: 426,
    status: "UpgradeRequired",
  },
  {
    statusCode: 428,
    status: "PreconditionRequired",
  },
  {
    statusCode: 429,
    status: "TooManyRequests",
  },
  {
    statusCode: 431,
    status: "RequestHeaderFieldsTooLarge",
  },
  {
    statusCode: 451,
    status: "UnavailableForLegalReasons",
  },
  {
    statusCode: 500,
    status: "InternalServerError",
  },
  {
    statusCode: 501,
    status: "NotImplemented",
  },
  {
    statusCode: 502,
    status: "BadGateway",
  },
  {
    statusCode: 503,
    status: "ServiceUnavailable",
  },
  {
    statusCode: 504,
    status: "GatewayTimeout",
  },
  {
    statusCode: 505,
    status: "HTTPVersionNotSupported",
  },
  {
    statusCode: 506,
    status: "VariantAlsoNegotiates",
  },
  {
    statusCode: 507,
    status: "InsufficientStorage",
  },
  {
    statusCode: 508,
    status: "LoopDetected",
  },
  {
    statusCode: 509,
    status: "BandwidthLimitExceeded",
  },
  {
    statusCode: 510,
    status: "NotExtended",
  },
  {
    statusCode: 511,
    status: "NetworkAuthenticationRequired",
  },
];

let httpCodes = {};
for (let httpCode of HTTP_CODES) {
  if (httpCode.statusCode >= 400) {
    httpCodes[httpCode.status] = function (error) {
      let response = JSON.parse(JSON.stringify(httpCode));
      response.ok = false;
      response.result = "failure";
      response.error = error;
      return response;
    };
  } else if (httpCode.statusCode >= 200) {
    httpCodes[httpCode.status] = function (data) {
      let response = JSON.parse(JSON.stringify(httpCode));
      response.ok = true;
      response.result = "success";
      response.data = data;
      return response;
    };
  }
}

function sendResponse(res, response) {
  return res.status(response.statusCode).json(response);
}

module.exports = {
  httpCodes,
  sendResponse,
};
