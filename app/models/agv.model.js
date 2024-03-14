/**
 * @swagger
 * components:
 *   schemas:
 *     AGV:
 *       type: object
 *       required:
 *         - code
 *         - description
 *       properties:
 *         code:
 *           type: string
 *         description:
 *           type: string
 *       example:
 *         code: qaz
 *         description: qaz
 */

const mongoose = require("mongoose");

const AGVSchema = new mongoose.Schema({
    code: String,
    description: String,
}, { collection: 'agvs' });

const AGV = mongoose.model('AGV', AGVSchema);


module.exports = AGV;
