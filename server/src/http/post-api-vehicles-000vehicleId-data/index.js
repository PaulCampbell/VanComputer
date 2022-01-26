let { tables } = require("@architect/functions");
let arc = require("@architect/functions");
const vehicleAuth = require("@architect/shared/vehicle-auth");
const failedResponse = require("@architect/shared/failed-response");

exports.handler = arc.http.async(vehicleAuth, handler);

async function handler(req) {
  if (req.params.vehicleId != req.vehicleId) {
    return failedResponse({ statusCode: 404, message: "Vehicle not found" });
  }

  const data = await tables();
  const vehicles = await data.vehicles.query({
    KeyConditionExpression: "userId = :userId AND vehicleId = :vehicleId",
    ExpressionAttributeValues: {
      ":userId": req.userId,
      ":vehicleId": req.vehicleId,
    },
  });

  if (vehicles.Count === 0) {
    return failedResponse({ statusCode: 404, message: "Vehicle not found" });
  }

  if (rateLimited(req) && (await rateExceeded(req, data))) {
    return failedResponse({ statusCode: 429, message: "Too many requests" });
  }

  const vehicleData = req.body;
  const expires = new Date();
  expires.setDate(expires.getDate() + 2);
  const v = await data.vehicleData.put(
    Object.assign({}, vehicleData, {
      vehicleId: req.params.vehicleId,
      dateTime: new Date().toISOString(),
      expires: expires.getTime(),
    })
  );

  return {
    statusCode: 201,
    headers: { "content-type": "application/json" },
    cors: true,
    body: JSON.stringify(v),
  };
}

const rateLimited = (req) => {
  return (
    process.env.NODE_ENV === "testing" && req.query["ratelimit"] != "false"
  );
};

const rateExceeded = async (req, data) => {
  const existingData = await data.vehicleData.query({
    KeyConditionExpression: "vehicleId = :vehicleId",
    ExpressionAttributeValues: {
      ":vehicleId": req.vehicleId,
    },
    ScanIndexForward: false,
    Limit: 1,
  });

  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);
  if (existingData.Count === 1) {
    console.log(twoMinutesAgo);
    console.log(new Date(existingData.Items[0].dateTime));
  }
  if (
    existingData.Count === 1 &&
    new Date(existingData.Items[0].dateTime) > twoMinutesAgo
  )
    return true;
};
