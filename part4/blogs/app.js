const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

mongoose.connect(config.MONGODB_URI)
  .then(_result => console.log("connected to database"))
  .catch(_error => console.log("could not connect to database"));

app.use(cors())
app.use(express.json())
app.use("/api", blogsRouter);
app.use("/api/users", usersRouter);

module.exports = app;
