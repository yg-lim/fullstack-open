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
      .expect(201)
      .expect('Content-Type', /application\/json/)

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
      .expect(201)
      .expect('Content-Type', /application\/json/)

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
      .expect('Content-Type', /application\/json/)

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

describe('blog posts are deleted', () => {
  test('deleted blog cannot be found', async function() {
    const newBlog = {
      title: "title",
      url: "url",
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .expect(204);

    await api
      .get(`/api/blogs/${response.body.id}`)
      .expect(404);
  })
})

describe('blog likes are updated', () => {
  test('returned blog has updated likes', async function () {
    const newBlog = {
      title: "title",
      url: "url.url",
      likes: 10,
    }

    const newBlogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .post(`/api/blogs/${newBlogResponse.body.id}`)
      .send({ likes: 25 })
      .expect(200)

    const updatedBlogResponse = await api
      .get(`/api/blogs/${newBlogResponse.body.id}`)
      .expect(200)

    assert.strictEqual(updatedBlogResponse.body.likes, 25);
  })
})

after(async function() {
  await mongoose.connection.close();
})
