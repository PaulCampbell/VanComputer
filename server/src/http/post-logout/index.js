// learn more about HTTP functions here: https://arc.codes/http
exports.handler = async function http (req) {
  return {
    statusCode: 200,
    headers: {
      'set-cookie': 'access_token=gone; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }
}