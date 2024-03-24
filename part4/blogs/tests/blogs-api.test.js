const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const { initialData } = require("./seed-data");

const api = supertest(app);

beforeEach(async function() {
  await Blog.deleteMany({});

  const newBlogs = initialData
    .map(blog => new Blog(blog))
    .map(async (blog) => blog.save());
  await Promise.all(newBlogs);
})

describe('mongoose docs are loaded', () => {
  test('GET request returns correct number of blogs', async function() {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, initialData.length);
  })

  test('unique identifier of docs is `id` and not `_id`', async function() {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.every(blog => blog.hasOwnProperty('id') && !blog.hasOwnProperty('_id')), true)
  })
})

describe('new blog successfully created', () => {
  test('new doc is present in database', async function() {
    const initialBlog = {
      title: "title of my blog",
      author: "someone anon",
      url: "fakeurl.com",
      likes: 1,
    };

    await api.post('/api/blogs')
      .send(initialBlog)
      .expect(201);

    const allBlogs = await Blog.find({});
    assert.strictEqual(allBlogs.length, initialData.length + 1);
  })

  test('new doc is succesfully retrieved', async function() {
    const initialBlog = {
      title: "title of my blog",
      author: "someone anon",
      url: "fakeurl.com",
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(initialBlog)
      .expect(201);

    const results = await Blog.find(initialBlog);
    const foundBlog = results[0];

    assert.strictEqual(Object.keys(initialBlog).every(key => initialBlog[key] === foundBlog[key]), true);
  })
})

describe('missing properties of blogs are handled', () => {
  test('missing likes property defaults to 0', async function() {
    const initialBlog = {
      title: "title",
      author: "author",
      url: "url.url"
    };

    await api
      .post('/api/blogs')
      .send(initialBlog)
      .expect(201)

    const results = await Blog.find(initialBlog);
    const foundBlog = results[0];

    assert.strictEqual(foundBlog.likes, 0);
  })

  test('docs with missing title or url properties cannot be added', async function () {
    const missingUrl = {
      title: "title",
      author: "author",
      likes: 123,
    };

    const missingTitle = {
      url: "url.url",
      author: "author",
      likes: 123,
    }

    await api
      .post('/api/blogs')
      .send(missingUrl)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(missingTitle)
      .expect(400)

    const allBlogs = await Blog.find({})

    assert.strictEqual(allBlogs.length, initialData.length);
  })
})

after(async function() {
  await mongoose.connection.close();
})
