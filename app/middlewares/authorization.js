const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const authJwt = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).send({
      message: "Unauthorized, No token provided!"
    });
  }

  token = token.slice(7); 

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;

    User.findByPk(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        req.user = user; 
        next();
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Error retrieving user."
        });
      });
  });
};

module.exports = authJwt;
