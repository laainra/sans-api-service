const controller = require("../controllers/user.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user", [authJwt], controller.getUserData);

  app.post("/api/user", [authJwt], controller.updateUserData);
};
