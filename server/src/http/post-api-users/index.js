let arc = require('@architect/functions')
let { v4: uuidv4 } = require('uuid');
let { tables } = require('@architect/functions')

let userSchema = require('@architect/shared/user-schema')

let hashPassword = require('@architect/shared/hash-password')

exports.handler = arc.http.async(http)

async function http(req) {
  const user = JSON.parse(req.body);
  
  let data = await tables()
  const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

  const { error,value  } = userSchema.validate(user, options);

  if(error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }
  
  const userId = uuidv4();
  const hashedPassword = await hashPassword(value.password);
  
  await data.users.put({
    userId,
    email: value.email,
    hashedPassword
  })

  return {
    statusCode: 201,
    headers: {
      location: `${process.env.ROOT_URL}/users/${userId}`
    }
  };
};
