/**
 * @swagger
 * tags:
 *   name: AGV
 * /agv:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: tampil semua data agv
 *     tags: [AGV]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   post:
 *     security:
 *      - Bearer: [] 
 *     summary: insert data agv
 *     tags: [AGV]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AGV'
 *     responses:
 *       200:
 *         description: Update success.
 *       403:
 *         description: Unauthenticated.
 * /agv/{id}:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data agv
 *     tags: [AGV]
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
 *             $ref: '#/components/schemas/AGV'
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data agv
 *     tags: [AGV]
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
 *     summary: hapus data agv
 *     tags: [AGV]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const controller = require("../controllers/agv.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/agv", 
  // [authJwt],
   controller.getAllAgvData);

  app.get("/api/agv/:id", 
  // [authJwt], 
  controller.findAgvData);

  app.post("/api/agv", 
  // [authJwt],
   controller.insertAgvData);

  app.put("/api/agv/:id", 
  // [authJwt], 
  controller.updateAgvData);

  app.delete("/api/agv/:id", 
  // [authJwt],
   controller.deleteAgvData);
};
