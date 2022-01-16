let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const vehicleAuth = require('@architect/shared/vehicle-auth')
const failedResponse = require('@architect/shared/failed-response')

exports.handler = arc.http.async(vehicleAuth, handler) 

async function handler (req) {

  if(req.params.vehicleId != req.vehicleId) {
    return failedResponse({statusCode: 404, message: 'Vehicle not found'})
  }

  const data = await tables()
  const vehicles = await data.vehicles.query({
    KeyConditionExpression: 'userId = :userId AND vehicleId = :vehicleId',
    ExpressionAttributeValues: {
      ':userId': req.userId,
      ':vehicleId': req.vehicleId
    }
  })

  if(vehicles.Count === 0) {
    return failedResponse({statusCode: 404, message: 'Vehicle not found'})
  }


  const vehicleData = req.body
  const v = await data.vehicleData.put(
    Object.assign(
      {}, 
      vehicleData, 
      {
        vehicleId: req.params.vehicleId,
        dateTime: new Date().toISOString(),
      })
    )
 
  return {
    statusCode: 201,
    headers: { 'content-type': 'application/json' },
    cors: true,
    body: JSON.stringify(v)
  }
}