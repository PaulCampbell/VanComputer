const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

test('setup', async t => {
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')
})

test('post /users success', async t => {
  t.plan(2)
  let result = await tiny.post({ 
      url: 'http://localhost:3333/api/users', 
      data: JSON.stringify({
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
  })
  t.ok(result, 'got 201 response')
  t.ok(result.headers.location, 'location header exists')
})

test('post /users fail', async t => {
  t.plan(2)
  try {
    await tiny.post({ 
      url: 'http://localhost:3333/api/users', 
      data: JSON.stringify({
        email: 'not an email',
        password: 'password123',
        confirmPassword: 'doesn\'t match'
      })
    })
  } catch (ex) {
    t.equal(ex.body.details.length, 2, 'got 2 errors')
    t.equal(ex.statusCode, 400, 'got 400 response')
  }
})

test('teardown', async t => {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})