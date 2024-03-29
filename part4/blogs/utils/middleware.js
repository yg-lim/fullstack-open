const jwt = require("jsonwebtoken");

function tokenExtractor(req, _res, next) {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }

  next();
}

module.exports = {
  tokenExtractor,
}
