let { tables } = require('@architect/functions')
const tryAuthUser = require('@architect/shared/try-auth-user')
const Joi = require('joi');

const vehicleSchema = Joi.object({
  id: Joi.string().min(3).required(),
  name: Joi.string().min(3).required()
});

exports.handler = async function http (req) {
  let user
  try {
    user = await tryAuthUser(req)
  } catch (ex) {
    return {
      statusCode: 401,
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        message: ex.message
      })
    }
  }

  const vehicle = JSON.parse(req.body)
  const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

  const { error, value  } = vehicleSchema.validate(vehicle, options);

  if(error) {
    return {
      statusCode: 400,
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(error)
    }
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