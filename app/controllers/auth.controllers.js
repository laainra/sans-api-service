const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

// Sign Up
exports.signup = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((existingUser) => {
      if (existingUser) {
        res
          .status(400)
          .send({
            message: "Username is already taken! User registration failed.",
          });
      } else {
        User.create({
          name: req.body.name,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
        })
          .then((user) => {
            res.send({ message: "User was registered successfully!"});
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


// Sign In
exports.signin = (req, res) => {
    User.findOne({
      username: req.body.username,
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
  
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            name: user.name,
          },
          config.secret,
          {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
          }
        );
  
        res.status(200).send({
          id: user.id,
          username: user.username,
          name: user.name,
          accessToken: token,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  };

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
