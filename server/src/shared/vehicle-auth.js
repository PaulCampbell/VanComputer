let arc = require('@architect/functions')
const nJwt = require('njwt');
const failedResponse = require('./failed-response')


module.exports = async function (req) {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return failedResponse({statusCode: 401, message: 'no authorization header'})
  }

  const token = authHeader.split(' ')[1];
  let verifiedJwt
  try{
    verifiedJwt = nJwt.verify(token, process.env.JWT_SIGNING_KEY);
  } catch(e) {
    return failedResponse({statusCode: 401, message: e.message})
  }

  const { sub, forUser } = verifiedJwt.body;

  req.vehicleId = sub.split('/')[1]
  req.userId = forUser
}

