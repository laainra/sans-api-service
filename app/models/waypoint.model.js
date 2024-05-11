/**
 * @swagger
 * components:
 *   schemas:
 *     Waypoint:
 *       type: object
 *       required:
 *         - pose_from
 *         - pose_to
 *         - time_start
 *         - time_end
 *         - status
 *       properties:
 *         Pose_from:
 *           $ref: '#/components/schemas/Pose'
 *         Pose_to:
 *           $ref: '#/components/schemas/Pose'
 *         time_start:
 *           type: string
 *           format: date-time
 *         time_end:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *       example:
 *         Pose_from:
 *          code: POSE-A
 *          x: 3
 *          y: 2
 *          z: 5
 *          w: 1
 *         Pose_to:
 *          code: POSE-B
 *          x: 4
 *          y: 5
 *          z: 6
 *          w: 1
 *         time_start: '2024-04-25T08:00:00Z'
 *         time_end: '2024-04-25T09:00:00Z'
 *         status: 'finished'
 */

const mongoose = require("mongoose");
const Pose = require("./pose.model");

const WaypointSchema = new mongoose.Schema(
  {
    pose_from: Pose.schema,
    pose_to: Pose.schema,
    time_start: Date,
    time_end: Date,
    status: String, //unexecuted, on process, finished
  },
  { collection: "waypoints" }
);

const Waypoint = mongoose.model("Waypoint", WaypointSchema);

module.exports = Waypoint;
