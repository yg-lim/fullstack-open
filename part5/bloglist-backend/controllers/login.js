const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordMatches = user === null ?
    false : await bcrypt.compare(password, user.password);

  if (!(user && passwordMatches)) {
    res.status(401).send("Invalid username or password");
    return;
  }

  const userTokenData = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userTokenData, process.env.SECRET);
  res.set('Authorization', `Bearer ${token}`);
  res.status(201).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
