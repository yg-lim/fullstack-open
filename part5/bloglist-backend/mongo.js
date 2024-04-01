const mongoose = require("mongoose");
const User = require("./models/user");
const Blog = require("./models/blog");
const config = require("./utils/config");

mongoose.connect(config.MONGODB_URI)
  .then(_result => console.log("connected to the database"))
  .catch(_error => console.log("could not connect to database"));

async function clear() {
  await User.deleteMany({});
  await Blog.deleteMany({});
  mongoose.connection.close();
}

async function admin() {
  
}
