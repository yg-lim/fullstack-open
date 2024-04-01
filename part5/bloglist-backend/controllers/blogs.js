const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const requiresAuthentication = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  next();
};

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

blogsRouter.post('/', requiresAuthentication, async (request, response) => {
  const user = await User.findById(request.user);
  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  const result = await blog.save();
  response.status(201).json(result);

  user.blogs = user.blogs.concat(blog._id);
  await user.save();
})

blogsRouter.delete('/:id', requiresAuthentication, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== request.user) {
    response.status(401);
    return;
  }

  await blog.deleteOne();
  response.status(204).json({ message: "deleted!" });
})

blogsRouter.put('/:id', requiresAuthentication, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== request.user) {
    response.status(401);
    return;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
  response.json(updatedBlog);
})

module.exports = blogsRouter;
