let { tables } = require('@architect/functions')
const nJwt = require('njwt');

module.exports = async function (req) {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    throw new Error('no authorization header')
  }

  const token = authHeader.split(' ')[1];
  let verifiedJwt
  try{
    verifiedJwt = nJwt.verify(token, process.env.JWT_SIGNING_KEY);
  } catch(e) {
    throw new Error(e.message)
  }

  const { sub } = verifiedJwt.body;
  let data = await tables()
  const user = await data.users.get({userId: sub.split('/')[1]});

  if(!user) {
      throw new Error('user not found')
  }

  return user
}