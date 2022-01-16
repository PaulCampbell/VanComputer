let { tables } = require('@architect/functions')
let arc = require('@architect/functions')
const auth = require('@architect/shared/auth')
const Joi = require('joi')
const hri = require('human-readable-ids').hri

const failedResponse = require('@architect/shared/failed-response')

const vehicleSchema = Joi.object({
  name: Joi.string().min(3).required()
});


exports.handler = arc.http.async(auth, handler) 

async function handler (req) {
  const vehicle = req.body
  const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

  const { error, value  } = vehicleSchema.validate(vehicle, options);
  if(error) {
    return failedResponse({statusCode: 400, body: error})
  }
  const data = await tables()

  const v = await data.vehicles.put({
    userId: req.user.userId,
    name: value.name,
    vehicleId: hri.random()
  })

  return {
    statusCode: 201,
    cors:true,
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify(v)
  }
}