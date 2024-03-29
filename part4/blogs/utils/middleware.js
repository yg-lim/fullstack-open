const jwt = require("jsonwebtoken");

function tokenExtractor(req, _res, next) {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }

  next();
}

function userExtractor(req, _res, next) {
  if (req.token) {
    const user = jwt.verify(req.token, process.env.SECRET);
    req.user = user.id;
  }

  next();
}

module.exports = {
  tokenExtractor,
  userExtractor,
};
