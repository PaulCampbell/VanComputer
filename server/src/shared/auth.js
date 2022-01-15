let arc = require('@architect/functions')
let { tables } = require('@architect/functions')
const nJwt = require('njwt');

const failedResponse = require('./failed-response')



module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res(failedResponse({statusCode: 401, message: 'no authorization header'}))
  }

  const token = authHeader.split(' ')[1];
  let verifiedJwt
  try{
    verifiedJwt = nJwt.verify(token, process.env.JWT_SIGNING_KEY);
  } catch(e) {
    return res(failedResponse({statusCode: 401, message: e.message}))
  }

  const { sub } = verifiedJwt.body;
  let data = await tables()
  const user = await data.users.get({userId: sub.split('/')[1]});

  if(!user) {
      return res(failedResponse({statusCode: 401, message: 'User not found'}))
  }

  req.user = user
  next()
}

