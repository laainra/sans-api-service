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
 *         - device_type
 *       properties:
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         ip:
 *           type: string
 *         device_type:
 *           type: string
 *       example:
 *         code: qaz
 *         description: qaz
 *         ip: ws://172.29.122.58:9090
 *         device_type: lidar
 */

const mongoose = require("mongoose");

const AGVSchema = new mongoose.Schema({
    code: String,
    description: String,
    device_type: String,
    ip: String,
}, { collection: 'agvs' });

const AGV = mongoose.model('AGV', AGVSchema);


module.exports = AGV;
