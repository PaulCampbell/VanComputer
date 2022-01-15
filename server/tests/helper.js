const tiny = require('tiny-json-http')

exports.createUser = async function createUser ({email, password}) {
  const createUserResponse = await tiny.post({ 
    url: 'http://localhost:3333/api/users', 
    data: JSON.stringify({
      email,
      password,
      confirmPassword: password
    })
  })
  return createUserResponse
}
exports.loginUser = async function loginUser ({email, password}) {
  let result = await tiny.post({ 
    url: 'http://localhost:3333/login', 
    data: {
      email,
      password
    }
  })
  
  return result.body
}

exports.createVehicle = async function createVehicle ({id, name, token}) {
  const response = await tiny.post({ 
    url: 'http://localhost:3333/api/vehicles', 
    data: {
      id,
      name,
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response
}