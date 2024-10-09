const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, `${process.env.JWT_SECRET_Key}`, {
    expiresIn: `${process.env.JWT_EXPIRE}`,
  });

module.exports = createToken;
