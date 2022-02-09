const test = require("tape");
const tiny = require("tiny-json-http");
const sandbox = require("@architect/sandbox");

const { createUser, loginUser } = require("./helper");

let token;
test("setup", async (t) => {
  t.plan(3);
  await sandbox.start();
  t.ok(true, "sandbox started on http://localhost:3333");

  // create a user for the tests
  const createUserResponse = await createUser({
    email: "test@test.com",
    password: "password123",
  });
  t.ok(createUserResponse, "user created");

  const loginResponse = await loginUser({
    email: "test@test.com",
    password: "password123",
  });
  token = loginResponse.token;
  t.ok(token, "user logged in, jwt aquired");
});

test("post /vehicles - no jwt... 401", async (t) => {
  t.plan(1);
  try {
    await tiny.post({
      url: "http://localhost:3333/api/vehicles",
      data: {
        id: "vehicle-1",
        name: "Ernie the Camper",
      },
    });
  } catch (ex) {
    t.equal(ex.statusCode, 401, "got 401 response");
  }
});

test("post /vehicles - good jwt, bad request body", async (t) => {
  t.plan(2);
  try {
    const response = await tiny.post({
      url: "http://localhost:3333/api/vehicles",
      data: {
        id: "vehicle-1",
        name: "",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (ex) {
    t.equal(ex.statusCode, 400, "got 400 response");
    t.equal(ex.body.details.length, 1, "got 1 error");
  }
});

test("post /vehicles - good jwt, good body", async (t) => {
  t.plan(2);
  const response = await tiny.post({
    url: "http://localhost:3333/api/vehicles",
    data: {
      id: "vehicle-1",
      name: "Ernie the Camper",
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  t.ok(response, "got 201 response");
  t.equal(response.body.name, "Ernie the Camper", "got vehicle name");
});

test("teardown", async (t) => {
  t.plan(1);
  await sandbox.end();
  t.ok(true, "sandbox ended");
});
