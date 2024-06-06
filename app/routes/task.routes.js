/**
 * @swagger
 * tags:
 *   name: Task
 *   description: API untuk mengelola data task (task)
 * /api/task/{id}:
 *   delete:
 *     summary: Menghapus task berdasarkan ID
 *     description: Menghapus task dari database berdasarkan ID yang diberikan.
 *     security:
 *      - Bearer: []
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID task yang akan dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: task berhasil dihapus.
 *       404:
 *         description: task tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 * /api/task/{type}:
 *   post:
 *     summary: Mendapatkan data task berdasarkan jenis (type)
 *     description: Mendapatkan data task dari database berdasarkan jenis (type) yang diberikan dan rentang tanggal tertentu.
 *     security:
 *      - Bearer: []
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Jenis task yang akan dicari
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-05-01"
 *                 description: Tanggal mulai pencarian
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-05-10"
 *                 description: Tanggal akhir pencarian
 *             required:
 *               - start_date
 *               - end_date
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data task.
 *       401:
 *         description: Data task tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 *   get:
 *     summary: Mendapatkan data task berdasarkan jenis (type)
 *     description: Mendapatkan data task dari database berdasarkan jenis (type) yang diberikan.
 *     security:
 *      - Bearer: []
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Jenis task yang akan dicari
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data task.
 *       401:
 *         description: Data task tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 * /api/task:
 *   post:
 *     summary: Menambahkan task baru
 *     description: Menambahkan task baru ke database.
 *     security:
 *      - Bearer: []
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agv:
 *                 type: string
 *                 description: Kode AGV
 *                 example: "AGV-A"
 *               station_from:
 *                 type: string
 *                 description: Kode stasiun asal
 *                 example: "ST-A"
 *               station_to:
 *                 type: string
 *                 description: Kode stasiun tujuan
 *                 example: "ST-B"
 *               time_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-05T08:00:00Z"
 *                 description: Waktu mulai task
 *               time_end:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-05T08:30:00Z"
 *                 description: Waktu selesai task
 *             required:
 *               - agv
 *               - station_from
 *               - station_to
 *               - time_start
 *               - time_end
 *     responses:
 *       201:
 *         description: Task berhasil ditambahkan.
 *       400:
 *         description: Data yang diberikan tidak valid.
 *       404:
 *         description: AGV atau stasiun tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan server.
 */

const controller = require("../controllers/task.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/task/:type", [authJwt], controller.getTaskDataByDate);

  app.get("/api/task", [authJwt], controller.getAllTaskData);
  app.get("/api/task/:type", [authJwt], controller.getTaskDataByType);

  app.post(
    "/api/task",
    // [authJwt],
    controller.insertTask
  );

  app.delete("/api/task/:id", [authJwt], controller.deletetaskData);
};
