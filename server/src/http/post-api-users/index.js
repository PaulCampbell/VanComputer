let arc = require('@architect/functions')
let { v4: uuidv4 } = require('uuid');
let { tables } = require('@architect/functions')
let bcrypt = require('bcryptjs')

let userSchema = require('@architect/shared/user-schema')

exports.handler = arc.http.async(http)

async function http(req) {
  console.log(`post /users ${JSON.stringify(req.body)}`)
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
  const hashedPassword = hashPassword(value.password);

  await data.users.put({
    userId,
    email: value.email,
    hashedPassword
  })

  return {
    statusCode: 201,
    headers: {
      location: `/users/${userId}`
    }
  };
};


let hashPassword = async function (plaintextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err)
      bcrypt.hash(plaintextPassword, salt, (error, hash) => {
        if (error) reject(error)
        resolve(hash)
      })
    })
  })
}