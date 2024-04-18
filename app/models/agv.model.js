/**
 * @swagger
 * components:
 *   schemas:
 *     AGV:
 *       type: object
 *       required:
 *         - code
 *         - description
 *         - ip
 *         - type
 *       properties:
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         ip:
 *           type: string
 *         type:
 *           type: string
 *       example:
 *         code: qaz
 *         description: qaz
 *         ip: ws://172.29.122.58:9090
 *         type: lidar
 */

const mongoose = require("mongoose");

const AGVSchema = new mongoose.Schema({
    code: String,
    description: String,
    ip: String,
    type: String,
}, { collection: 'agvs' });

const AGV = mongoose.model('AGV', AGVSchema);


module.exports = AGV;
