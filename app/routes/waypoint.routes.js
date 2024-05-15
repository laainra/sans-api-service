/**
 * @swagger
 * tags:
 *   name: Waypoint
 *   description: API untuk mengelola data waypoint (waypoint)
 * /api/waypoint/{id}:
 *   put:
 *     summary: Mengubah data waypoint berdasarkan id
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pose'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Waypoint]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 *   delete:
 *     summary: Menghapus waypoint berdasarkan ID
 *     description: Menghapus waypoint dari database berdasarkan ID yang diberikan.
 *     security:
 *       - Bearer: []
 *     tags: [Waypoint]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID waypoint yang akan dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Waypoint berhasil dihapus.
 *       404:
 *         description: Waypoint tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 *   get:
 *     summary: Mendapatkan data waypoint berdasarkan jenis (type)
 *     description: Mendapatkan data waypoint dari database berdasarkan jenis (type) yang diberikan.
 *     security:
 *       - Bearer: []
 *     tags: [Waypoint]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Jenis waypoint yang akan dicari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data waypoint.
 *       401:
 *         description: Data waypoint tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 * /api/waypoint:
 *   post:
 *     summary: Menambahkan waypoint baru
 *     description: Menambahkan waypoint baru ke database.
 *     security:
 *       - Bearer: []
 *     tags: [Waypoint]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pose_from:
 *                 type: string
 *                 description: Kode posisi asal
 *                 example: "POSE-1"
 *               pose_to:
 *                 type: string
 *                 description: Kode posisi tujuan
 *                 example: "POSE-2"
 *               time_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-05T08:00:00Z"
 *                 description: Waktu mulai waypoint
 *               time_end:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-05T08:30:00Z"
 *                 description: Waktu selesai waypoint
 *               status:
 *                 type: string
 *                 example: "On-Going"
 *                 description: Status perjalanan waypoint
 *             required:
 *               - pose_from
 *               - pose_to
 *               - time_start
 *               - time_end
 *               - status
 *     responses:
 *       201:
 *         description: Waypoint berhasil ditambahkan.
 *       400:
 *         description: Data yang diberikan tidak valid.
 *       404:
 *         description: AGV atau posisi tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 */


const controller = require("../controllers/waypoint.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/waypoint/date",
    // [authJwt],
    controller.getWaypointDataByDate
  );

  app.get(
    "/api/waypoint",
    // [authJwt],
    controller.getAllWaypointData
  );

  app.post(
    "/api/waypoint",
    // [authJwt],
    controller.insertWaypoint
  );
  app.put(
    "/api/waypoint/:id",
    // [authJwt],
    controller.updateWaypointData
  );

  app.delete("/api/waypoint/:id", [authJwt], controller.deleteWaypointData);
};
