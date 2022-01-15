let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const auth = require('@architect/shared/auth')
const failedResponse = require('@architect/shared/failed-response')

exports.handler = arc.http(auth, handler) 

async function handler (req, res) {
  const user = req.user
  const data = await tables()
  const vehicles = await data.vehicles.query({
    KeyConditionExpression: 'userId = :userId AND vehicleId = :vehicleId',
    ExpressionAttributeValues: {
      ':userId': user.userId,
      ':vehicleId': req.params.vehicleId
    }
  })

  if(vehicles.Count === 0) {
    return res(failedResponse({statusCode: 404, message: 'Vehicle not found'}))
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
 
  return res({
    statusCode: 201,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(v)
  })
}