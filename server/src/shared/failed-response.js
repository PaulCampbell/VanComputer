module.exports = function ({statusCode = 400, message, body}) {
  if(message && body) {
    console.error(`response should contain either a message or a body. Using message: ${message}`)
  }
  const data = message ?
    JSON.stringify({
      details: [
        {
          message,
        }
      ]
    })
  : JSON.stringify(body)

 return {
    statusCode,
    cors: true,
    headers: {
      'content-type': 'application/json'
    },
    body: data
  }
}