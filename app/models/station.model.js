/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - code
 *         - status
 *         - rfid
 *       properties:
 *         code:
 *           type: string
 *         status:
 *           type: string
 *         rfid:
 *           type: string
 *       example:
 *         code: ST-A
 *         status: 20.7,8.5
 *         rfid: 6363E6E3
 */

const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
    code: String,
    status: String,
    rfid: String,
}, { collection: 'stations' });

const Station = mongoose.model('Station', StationSchema);


module.exports = Station;
