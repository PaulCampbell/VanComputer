let { tables } = require('@architect/functions')
let bcrypt = require('bcryptjs')

const nJwt = require('njwt');

exports.handler = async function http (req) {
  console.log(`post /login ${req.body}`)
  const { email, password} = JSON.parse(req.body)
  let data = await tables()
  const users = await data.users.query(
    {
      IndexName: 'usersByEmail',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    })

  if (!users.Count === 1) {
    return failedResponse('login failed')
  }
  const [user] = users.Items

  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if(!passwordMatch) {
    return failedResponse('login failed')
  }

  var claims = {
    iss: process.env.ROOT_URL,  
    sub: `users/${user.userId}`,
    scope: "self"
  }
  const jwt = nJwt.create(claims,process.env.JWT_SIGNING_KEY);
  const oneYearFromNow = new Date();
  const now = new Date();
  oneYearFromNow.setYear(now.getYear() + 1);
  jwt.setExpiration(oneYearFromNow);
  
  const token = jwt.compact();

  return {
    statusCode: 200,
    headers: {
      'set-cookie': `access_token=${token}; domain=${process.env.ROOT_URL}; HttpOnly; expires=${oneYearFromNow.toUTCString()};`,
    },
    body: JSON.stringify({
      token
    })
  };
}

const failedResponse = (message) => {
  return {
    statusCode: 401,
    body: JSON.stringify({
      details: [
        {
          message,
        }
      ]
    })
  }
}