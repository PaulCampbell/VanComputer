const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

test('setup', async t => {
  t.plan(2)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')

  // create a user for the tests
  const createUserResponse = await tiny.post({ 
    url: 'http://localhost:3333/api/users', 
    data: JSON.stringify({
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
  })

  t.ok(createUserResponse, 'user created')
})

test('post /login success', async t => {
  t.plan(3)
  let result = await tiny.post({ 
    url: 'http://localhost:3333/login', 
    data: {
      email: 'test@test.com',
      password: 'password123'
    }
  })

  t.ok(result, 'got 200 response')
  t.ok(JSON.parse(result.body).token, 'token exists')
  t.ok(result.headers['set-cookie'], 'set cookie header exists')
})

test('post /login fail', async t => {
  t.plan(2)
  try {
    await tiny.post({ 
      url: 'http://localhost:3333/login', 
      data: {
        email: 'test@test.com',
        password: 'incorrect password',
      }
    })
  } catch (ex) {
    t.equal(JSON.parse(ex.body).details.length, 1, 'got 1 error')
    t.equal(ex.statusCode, 401, 'got 401 response')
  }
})

test('post /logout - remove cookie', async t => {
  t.plan(2)
  const result = await tiny.post({ 
    url: 'http://localhost:3333/logout'
  })
  t.ok(result, 'got 200 response')
  t.ok(result.headers['set-cookie'], 'set cookie header exists')
})

test('teardown', async t => {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})