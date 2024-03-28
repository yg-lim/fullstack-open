const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (_req, res) => {
  const result = await User.find({}).populate("blogs", { user: 0 });
  res.json(result);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  if (body.password.length < 3) {
    res.status(400).json({ error: "password must have at least 3 characters" });
    return;
  }
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
  
  const newUser = new User({
    username: body.username,
    name: body.name,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json(newUser);
});

module.exports = usersRouter;
