const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const { initialData } = require("./seed-data");

const api = supertest(app);

beforeEach(async function() {
  Blog.deleteMany({});
  
  const newBlogs = initialData
    .map(blog => new Blog(blog)) 
    .map(async (blog) => blog.save());
  await Promise.all(newBlogs);
})

describe("testing backend api", () => {
  test('GET request returns correct number of blogs', async function() {
    const response = await api.get('/api/blogs');
    assert(response.body.length, initialData.length);
  })

  test('unique identifier of docs is `id` and not `_id`', async function() {
    const response = await api.get('/api/blogs');
    assert(response.body.every(blog => blog.hasOwnProperty('id') && !blog.hasOwnProperty('_id')))
  })
})

after(async function() {
  await mongoose.connection.close();
})
