const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (_req, res) => {
  const result = await User.find({});
  res.json(result);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
  
  const newUser = new User({
    username: body.username,
    name: body.name,
    password: hashedPassword,
  });

  await newUser.save();
  res.json(newUser);
});

module.exports = usersRouter;
