const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

const { createUser, loginUser, createVehicle} = require('./helper')

let vehicleId

let token 
test('setup', async t => {
  t.plan(5)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')

  // create a user for the tests
  const createUserResponse = await createUser({email: 'test@test.com',password: 'password123'})
  t.ok(createUserResponse, 'user created')

  const loginResponse = await loginUser({email: 'test@test.com',password: 'password123'})
  loginResponse.token
  t.ok(loginResponse.token, 'user logged in, jwt aquired')

  // create a vehicle for the tests
  const createVehicleResponse = await createVehicle({
    name: 'Earnie the Camper',
    token: loginResponse.token
  })
  vehicleId = createVehicleResponse.body.vehicleId
  t.ok(createVehicleResponse, 'vehicle created')

  // get a vehicle token
  const vehicleTokenResponse = await tiny.post({
    url: `http://localhost:3333/api/vehicles/${vehicleId}/register`,
    data: { userId: createUserResponse.body.userId }
  })
  token = vehicleTokenResponse.body.token
  t.ok(token)
})

test('post /vehicle-data/:vehicleId/data - all good!', async t => {
  t.plan(1)

  const response = await tiny.post({ 
    url: `http://localhost:3333/api/vehicles/${vehicleId}/data`,
    data: {
      location: { longitude: -122.4194155, latitude: 37.7749295 },
      temperature: 17,
      humidity: 0.5,
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  t.ok(response, 'got good response')
})

test('post /vehicle-data/:not-my-id/data - nope', async t => {
  t.plan(1)
  try {
    await tiny.post({ 
      url: 'http://localhost:3333/api/vehicles/not-my-id/data',
      data: {
        location: { longitude: -122.4194155, latitude: 37.7749295 },
        temperature: 17,
        humidity: 0.5,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (ex) {
    t.equal(ex.statusCode, 404, 'got 404 response')
  }
})

test('teardown', async t => {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})