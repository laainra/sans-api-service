/**
 * @swagger
 * components:
 *   schemas:
 *     Pose:
 *       type: object
 *       required:
 *         - code
 *         - x
 *         - y
 *         - z
 *         - w
 *       properties:
 *         code:
 *           type: string
 *         x:
 *           type: string
 *         y:
 *           type: string
 *         z:
 *           type: string
 *         w:
 *           type: string
 *       example:
 *         code: POSE-A
 *         x: 3
 *         y: 2
 *         z: 5
 *         w: 1
 */

const mongoose = require("mongoose");

const PoseSchema = new mongoose.Schema({
    code: String,
    x: String,
    y: String,
    z: String,
    w: String,
}, { collection: 'poses' });

const Pose = mongoose.model('Pose', PoseSchema);


module.exports = Pose;
