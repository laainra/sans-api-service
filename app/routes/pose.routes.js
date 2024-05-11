/**
 * @swagger
 * tags:
 *   name: pose
 * /pose:
 *   get:
 *     security:
 *      - Bearer: []
 *     summary: tampil semua data pose
 *     tags: [pose]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   post:
 *     security:
 *      - Bearer: []
 *     summary: insert data pose
 *     tags: [pose]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pose'
 *     responses:
 *       200:
 *         description: Update success.
 *       403:
 *         description: Unauthenticated.
 * /pose/{id}:
 *   get:
 *     security:
 *      - Bearer: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data pose
 *     tags: [pose]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   put:
 *     security:
 *      - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pose'
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data pose
 *     tags: [pose]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   delete:
 *     security:
 *      - Bearer: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: hapus data pose
 *     tags: [pose]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const controller = require("../controllers/pose.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/pose", 
//   [authJwt],
   controller.getAllPoseData);

  //   app.get("/api/pose/:id", [authJwt], controller.findPoseData);

  app.post("/api/pose", 
//   [authJwt],
   controller.insertPoseData);

  app.put("/api/pose/:id", 
//   [authJwt],
   controller.updatePoseData);

  app.delete("/api/pose/:id", 
//   [authJwt],
   controller.deletePoseData);
};
