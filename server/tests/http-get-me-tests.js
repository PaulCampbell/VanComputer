const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

const { createUser, loginUser} = require('./helper')

let token, userId

test('setup', async t => {
  t.plan(3)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')

  // create a user for the tests
  const createUserResponse = await createUser({email: 'test@test.com',password: 'password123'})
  t.ok(createUserResponse, 'user created')

  const loginResponse = await loginUser({email: 'test@test.com', password: 'password123'})

  token = loginResponse.token
  userId = loginResponse.claims.sub.split('/')[1]

  t.ok(token, 'user logged in, jwt aquired')
})

test('get /api/me success', async t => {
  t.plan(2)
  let result = await tiny.get({ 
      url: `http://localhost:3333/api/me`,
      headers: {
        Authorization: `Bearer ${token}`
      }
  })
  t.ok(result, 'got 200 response')
  t.ok(result.body.vehicles, 'got vehicles')
})

test('get /api/me - fail', async t => {
  t.plan(1)
  try {
    await tiny.get({ 
      url: `http://localhost:3333/api/me`
  })
  } catch (ex) {
    t.equal(ex.statusCode, 401, 'got 401 response')
  }
})

test('teardown', async t => {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})