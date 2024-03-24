const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get('/blogs',async (_request, response) => {
  try {
    const results = await Blog.find({});
    response.json(results);
  } catch (error) {
    throw error;
  }
})

blogsRouter.post('/blogs', async (request, response) => {
  const blog = new Blog(request.body)
  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    response.status(400).send(error);
  }
})

module.exports = blogsRouter;
