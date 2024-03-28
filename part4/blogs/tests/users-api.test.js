const app = require("../app");
const supertest = require("supertest");
const User = require("../models/user");
const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async function () {
  await User.deleteMany({});
  console.log('database cleared');
});

describe('creating a new user', function () {
  test('user with username of less than 3 length cannot be created', async function () {
    const userData = {
      username: "a",
      password: "123",
      name: "A"
    };

    await api
      .post('/api/users')
      .send(userData)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('user with password of less than 3 length cannot be created', async function () {
    const userData = {
      username: "valid",
      password: "1",
      name: "valid name",
    };

    await api
      .post('/api/users')
      .send(userData)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('user with valid params is successfully created', async function () {
    const userData = {
      username: "valid",
      password: "valid",
      name: "valid name",
    };

    await api
      .post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('user with non-unique username is not created', async function () {
    const userData = {
      username: "valid",
      password: "valid",
      name: "valid name",
    };

    await api
      .post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const duplicateUser = userData;

    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

after(async function () {
  await mongoose.connection.close();
});
