/**
 * @swagger
 * tags:
 *   name: Auth
 * /auth/signup:
 *   post:
 *     summary: register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Register berhasil.
 *       400:
 *         description: Register gagal
 * /auth/signin:
 *   post:
 *     summary: login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: qaz
 *               password:
 *                 type: string
 *                 example: qaz
 *             required:
 *               - username
 *               - password   
 *     responses:
 *       200:
 *         description: Register berhasil.
 *       400:
 *         description: Register gagal
 */

const controller = require("../controllers/auth.controllers");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
