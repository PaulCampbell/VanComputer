let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const auth = require('@architect/shared/auth')

const failedResponse = require('@architect/shared/failed-response')

exports.handler = arc.http(auth, handler)

async function handler (req, res) {
  const user = req.user
  if(user.userId !== req.params.userId) {
    return res(failedResponse({statusCode: 401, message: 'Unauthorized'}))
  }

  const data = await tables()

  const vehicles = await data.vehicles.query({
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': user.userId
    }
  })

  const vehiclesWithData = await Promise.all(
    vehicles.Items.map(async vehicle => {
      const vehicleData = await data.vehicleData.query({
        KeyConditionExpression: 'vehicleId = :vehicleId',
        ExpressionAttributeValues: {
          ':vehicleId': vehicle.vehicleId
        },
        ScanIndexForward: false,
        Limit: 100
      })
      return Object.assign(vehicle, { vehicleData: vehicleData.Items })
    })
  )

  const responseData = {
    userId: user.userId,
    email: user.email,
    vehicles: vehiclesWithData
  }
  
  return res({
    statusCode: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(responseData)
  })
}