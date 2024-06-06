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
 *         code: POSE-1
 *         x: "3.1"
 *         y: "2.0"
 *         z: "0.2"
 *         w: "1.0"
 */

const mongoose = require("mongoose");

const PoseSchema = new mongoose.Schema(
  {
    code: String,
    x: Number,
    y: Number,
    z: Number,
    w: Number,
  },
  { collection: "poses" }
);

const Pose = mongoose.model("Pose", PoseSchema);

module.exports = Pose;
