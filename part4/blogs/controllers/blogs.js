const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get('/',async (_request, response) => {
  const results = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(results);
})

blogsRouter.get('/:id', async (request, response) => {
  const result = await Blog.findById(request.params.id);
  if (!result) {
    response.status(404).end();
    return;
  }

  response.json(result);
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({});
  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  const result = await blog.save();
  response.status(201).json(result);

  user.blogs = user.blogs.concat(blog._id);
  await user.save();
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
})

blogsRouter.post('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  response.json(updatedBlog);
})

module.exports = blogsRouter;
