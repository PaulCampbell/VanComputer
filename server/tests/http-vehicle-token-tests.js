const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')
const { createUser, loginUser, createVehicle } = require('./helper')
const { createVerifier } = require('njwt')

let vehicleId, userId
test('setup', async t => {
  t.plan(4)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')

  // create a user for the tests
  const createUserResponse = await createUser({email: 'test@test.com',password: 'password123'})
  t.ok(createUserResponse, 'user created')
  userId = createUserResponse.body.userId
  const loginResponse = await loginUser({email: 'test@test.com',password: 'password123'})
  token = loginResponse.token
  t.ok(token, 'user logged in, jwt aquired')

  // create a vehicle for the tests
  const createVehicleResponse = await createVehicle({
    name: 'Earnie the Camper',
    token
  })
  vehicleId = createVehicleResponse.body.vehicleId
  t.ok(createVehicleResponse, 'vehicle created')
})

test('post /vehicles/:vehicleId/register success', async t => {
  t.plan(2)
  let result = await tiny.post({ 
    url: `http://localhost:3333/api/vehicles/${vehicleId}/register`,
    data: { userId }
  })

  t.ok(result, 'got 200 response')
  t.ok(result.body.token, 'token exists')
})

test('post /vehicles/:vehicleId/register fail', async t => {
  t.plan(1)
  try {
    await tiny.post({ 
      url: 'http://localhost:3333/api/vehicles/bad-id/register',
      data: { userId }
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