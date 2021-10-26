const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("verma");
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log(token);
  jwt.verify(token, process.env.secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    next();
  });
};
