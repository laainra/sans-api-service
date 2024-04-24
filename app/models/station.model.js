/**
 * @swagger
 * components:
 *   schemas:
 *     Coordinate:
 *       type: object
 *       required:
 *         - x
 *         - y
 *       properties:
 *         x:
 *           type: double
 *         y:
 *           type: double
 *       example:
 *         x: 10.7
 *         y: 0.1
 *     Station:
 *       type: object
 *       required:
 *         - code
 *         - coordinate
 *         - status
 *       properties:
 *         code:
 *           type: string
 *         coordinate:
 *           $ref: '#/components/schemas/Coordinate'
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

const CoordinateSchema = new mongoose.Schema({
    x: Number,
    y: Number,
}, { _id : false });

const StationSchema = new mongoose.Schema({
    code: String,
    coordinate: CoordinateSchema,
    status: String,
}, { collection: 'stations' });

const Station = mongoose.model('Station', StationSchema);


module.exports = Station;
