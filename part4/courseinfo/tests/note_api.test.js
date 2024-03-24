const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert');
const Note = require("../models/note")

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is x',
    important: false,
  },
  {
    content: 'Browsers can only execute JavaScript',
    important: true,
  }
];

beforeEach(async function () {
  await Note.deleteMany({})
  initialNotes.forEach(async (note) => {
    const noteObject = new Note(note);
    await noteObject.save();
  })
})
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async function() {
  const response = await api.get('/api/notes');
  
  assert.strictEqual(response.body.length, 2)
})

test('the first note is about HTTP methods', async function() {
  const response = await api.get('/api/notes')
  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is x'), true)
})

after(async () => {
  await mongoose.connection.close()
})
