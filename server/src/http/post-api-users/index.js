let arc = require('@architect/functions')
let { v4: uuidv4 } = require('uuid');
let { tables } = require('@architect/functions')

let userSchema = require('@architect/shared/user-schema')

let hashPassword = require('@architect/shared/hash-password')

const failedResponse = require('@architect/shared/failed-response')

exports.handler = arc.http.async(http)

async function http(req) {
  const user = req.body;

  let data = await tables()
  const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

  const { error,value  } = userSchema.validate(user, options);

  if(error) {
    return failedResponse({statusCode: 400, body: error})
  }

  const users = await data.users.query({
    IndexName: 'usersByEmail',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': value.email.toLowerCase() }
  })

  if(users.Items.length > 0) {
    return failedResponse({statusCode: 400, message: 'User already exists'})
  }
  
  const userId = uuidv4();
  const hashedPassword = await hashPassword(value.password);
  
  await data.users.put({
    userId,
    email: value.email.toLowerCase(),
    hashedPassword
  })

  return {
    statusCode: 201,
    cors:true,
    headers: {
      location: `${process.env.ROOT_URL}/users/${userId}`
    },
    body: JSON.stringify({ 
      userId
    })
  };
};
