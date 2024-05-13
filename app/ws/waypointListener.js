/**
 * @swagger
 * tags:
 *   name: Websocket
 * /ws/connect/lidar:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Websocket to connect to AGV lidar
 *     description: |
 *       Send messages:
 *       - "ws://{ip}:9090" to connect to rosbridge.
 *       - { "command": "start", waypointId: "{id of the waypoint to start}"} to change status to 'on process'.
 *       - { "position": {"x": "0.0", "y":"0.0" }, "orientation":{"z":"0.0","w":"0.0"}}} to send waypoint pose to the robot (replace 0.0 with the appropriate pose coordinates).
 *     tags: [Websocket]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const Waypoint = require("../models/waypoint.model");
const { broadcast } = require("./websocket");

function waypointListener(ws) {
  const waypointChangeStream = Waypoint.watch();

  waypointChangeStream.on("change", async (change) => {
    const updatedWaypoint = await Waypoint.findById(change.documentKey._id);
    if (updatedWaypoint) {
      broadcast("connect/lidar", JSON.stringify({ waypoint: updatedWaypoint }));
    }
  });

  waypointChangeStream.on("error", (err) => {
    console.error("Waypoint change stream error:", err);
  });
}

module.exports = waypointListener;
