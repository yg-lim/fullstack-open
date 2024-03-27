const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get('/blogs',async (_request, response) => {
  const results = await Blog.find({});
  response.json(results);
})

blogsRouter.get('/blogs/:id', async (request, response) => {
  const result = await Blog.findById(request.params.id);
  if (!result) {
    response.status(404).end();
    return;
  }

  response.json(result);
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

blogsRouter.delete('/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
})

blogsRouter.post('/blogs/:id', async (request, response) => {
  const body = request.body;
  const blog = { ...body };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true });
  response.json(updatedBlog);
})

module.exports = blogsRouter;
