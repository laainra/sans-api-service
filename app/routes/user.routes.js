/**
 * @swagger
 * tags:
 *   name: User
 * /user:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: tampil profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   post:
 *     security:
 *      - Bearer: [] 
 *     summary: update profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Update success.
 *       403:
 *         description: Unauthenticated.
 */

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
