let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const nJwt = require('njwt');
const failedResponse = require('@architect/shared/failed-response')


// This is kind of shady
// It issues JWT tokens for vehicles, and is happy to hand them out to 
// anyone who posts to the url with a valid userId and vehicleId
// if the vehicle really belongs to the user.
// No one is guessing that thing, but it's only secure because it's obscure
// TODO: Think about this and fix it

exports.handler = arc.http.async(handler) 

async function handler (req) {
  const data = await tables()
  const vehicles = await data.vehicles.query({
    KeyConditionExpression: 'userId = :userId AND vehicleId = :vehicleId',
    ExpressionAttributeValues: {
      ':userId': req.body.userId,
      ':vehicleId': req.params.vehicleId
    }
  })

  if(vehicles.Count === 0) {
    return failedResponse({statusCode: 404, message: 'Vehicle not found'})
  }

  const v = vehicles.Items[0]
  v.activated = true
  await data.vehicles.put(v)

  var claims = {
    iss: process.env.ROOT_URL,  
    sub: `vehicles/${vehicles.Items[0].vehicleId}`,
    scope: "self",
    forUser: req.body.userId
  }
  const jwt = nJwt.create(claims,process.env.JWT_SIGNING_KEY);
  const oneYearFromNow = new Date();
  oneYearFromNow.setYear(oneYearFromNow.getFullYear() + 1);
  jwt.setExpiration(oneYearFromNow);
  const token = jwt.compact();

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json'
    },
    cors: true,
    body: JSON.stringify({
      token
    })
  }
}