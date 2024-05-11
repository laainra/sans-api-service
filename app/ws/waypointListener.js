const Waypoint = require("../models/waypoint.model");
const { broadcast } = require("./websocket");

function waypointListener(ws) {
  const waypointChangeStream = Waypoint.watch();

  waypointChangeStream.on("change", async (change) => {
    const updatedWaypoint = await Waypoint.findById(change.documentKey._id);
    if (updatedWaypoint) {
      broadcast("connect/lidar",JSON.stringify({ waypoint: updatedWaypoint }));
    }
  });

  waypointChangeStream.on("error", (err) => {
    console.error("Waypoint change stream error:", err);
  });
};

module.exports = waypointListener;