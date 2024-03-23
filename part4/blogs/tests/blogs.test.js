const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const seedData = require('./seed-data');

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('total likes of one blog list is equal to blog likes', () => {
    const oneBlogList = [{
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    }];

    assert.strictEqual(listHelper.totalLikes(oneBlogList), 7);
  });

  test('total likes of populated list is calculated correctly', () => {
    assert.strictEqual(listHelper.totalLikes(seedData), 36);
  })
});
