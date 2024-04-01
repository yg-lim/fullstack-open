const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");

mongoose.connect(config.MONGODB_URI)
  .then(_result => console.log("connected to database"))
  .catch(_error => console.log("could not connect to database"));

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const errorHandler = (error, _req, res, next) => {
  if (
    error.name === 'MongoServerError'
    && error.message.includes("E11000 duplicate key error")
  ) {
    res.status(400).json({ error: "username already exists in database" });
  } else if (
    error.name === 'ValidationError'
    && error.message.includes('User validation failed')
  ) {
    res.status(400).json({ error: "username must be at least 2 characters" });
  } else if (error.name === 'CastError') {
    res.status(404).json({ error: "could not be found" });
  } else if (
    error.name === 'ValidationError'
    && error.message.includes("Path `url` is required")
  ) {
    res.status(400).json({ error: "`url` is required" });
  } else if (
    error.name === 'ValidationError'
    && error.message.includes("Path `title` is required")
  ) {
    res.status(400).json({ error: '`title` is required' });
  } else {
    next(error);
  }
};

app.use(errorHandler);

module.exports = app;
