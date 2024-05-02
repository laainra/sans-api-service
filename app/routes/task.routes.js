/**
 * @swagger
 * tags:
 *   name: Task
 * /task/{id}:
 *   delete:
 *     security:
 *      - Bearer: [] 
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 * /task/{type}:
 *   post:
 *     summary: get task data by type
 *     security:
 *      - Bearer: [] 
 *     parameters:
 *      - in: path
 *        name: type
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 example: 2020-02-02
 *               end_date:
 *                 type: string
 *                 example: 2020-02-02
 *             required:
 *               - start_date
 *               - end_date 
 *     responses:
 *       200:
 *         description: Register berhasil.
 *       400:
 *         description: Register gagal
 */

const controller = require("../controllers/task.controllers");
const authJwt = require("../middlewares/authorization");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/task/:type",
    [authJwt],
    controller.getTaskData
  );

  app.delete("/api/task/:id", [authJwt], controller.deletetaskData);
};
