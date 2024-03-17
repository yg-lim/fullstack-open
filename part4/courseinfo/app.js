const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs");

mongoose.connect(config.MONGODB_URI)
  .then(_result => console.log("connected to database"))
  .catch(_error => console.log("could not connect to database"));

app.use(cors())
app.use(express.json())
app.use("/api", blogsRouter);

module.exports = app;
