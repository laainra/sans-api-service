/**
 * @swagger
 * tags:
 *   name: Station
 * /station:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: tampil semua data station
 *     tags: [Station]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   post:
 *     security:
 *      - Bearer: [] 
 *     summary: insert data station
 *     tags: [Station]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       200:
 *         description: Update success.
 *       403:
 *         description: Unauthenticated.
 * /station/{id}:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data station
 *     tags: [Station]
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
 *             $ref: '#/components/schemas/Station'
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *     summary: cari data station
 *     tags: [Station]
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
 *     summary: hapus data station
 *     tags: [Station]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const controller = require("../controllers/station.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/station", [authJwt], controller.getAllStationData);

  app.get("/api/station/:id", [authJwt], controller.findStationData);

  app.post("/api/station", [authJwt], controller.insertStationData);

  app.put("/api/station/:id", [authJwt], controller.updateStationData);

  app.delete("/api/station/:id", [authJwt], controller.deleteStationData);
};
