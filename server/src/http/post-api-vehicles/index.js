let { tables } = require('@architect/functions')
const tryAuthUser = require('@architect/shared/try-auth-user')
const Joi = require('joi');

const failedResponse = require('@architect/shared/failed-response')

const vehicleSchema = Joi.object({
  id: Joi.string().min(3).required(),
  name: Joi.string().min(3).required()
});

exports.handler = async function http (req) {
  let user
  try {
    user = await tryAuthUser(req)
  } catch (ex) {

    return failedResponse({statusCode: 401, message: ex.message})
  }

  const vehicle = JSON.parse(req.body)
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
    userId: user.userId,
    name: value.name,
    vehicleId: value.id
  })

  return {
    statusCode: 201,
    headers:{
      'content-type': 'application/json'
    },
    body: JSON.stringify(v)
  }
}