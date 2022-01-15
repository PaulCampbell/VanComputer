let { tables } = require('@architect/functions')
let bcrypt = require('bcryptjs')

const nJwt = require('njwt');

const failedResponse = require('@architect/shared/failed-response')

exports.handler = async function http (req) {
  const { email, password } = JSON.parse(req.body)
  let data = await tables()
  const users = await data.users.query({
    IndexName: 'usersByEmail',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email.toLowerCase() }
  })

  if (!users.Count === 1) {
    return failedResponse({statusCode: 401, message: 'login failed'})
  }
  const [user] = users.Items

  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if(!passwordMatch) {
    return failedResponse({statusCode: 401, message: 'login failed'})
  }

  var claims = {
    iss: process.env.ROOT_URL,  
    sub: `users/${user.userId}`,
    scope: "self"
  }
  const jwt = nJwt.create(claims,process.env.JWT_SIGNING_KEY);
  const oneYearFromNow = new Date();
  oneYearFromNow.setYear(oneYearFromNow.getFullYear() + 1);
  jwt.setExpiration(oneYearFromNow);
  
  const token = jwt.compact();

  return {
    statusCode: 200,
    headers: {
      'set-cookie': `access_token=${token}; domain=${process.env.ROOT_URL}; HttpOnly; expires=${oneYearFromNow.toUTCString()};`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      token,
      claims
    })
  };
}
