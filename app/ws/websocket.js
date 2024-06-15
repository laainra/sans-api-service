/**
 * @swagger
 * tags:
 *   name: Websocket
 * /ws/connect/lidar:
 *   get:
 *     summary: Connect to AGV lidar via WebSocket
 *     description: |
 *       Establish a WebSocket connection to the AGV lidar.
 *       **Sending Messages:**
 *       - **Send Pose:** To send a waypoint pose to the robot, use the following JSON format:
 *         ```json
 *         {
 *           "pose": {
 *             "position": {
 *               "x": 0.0,
 *               "y": 0.0
 *             },
 *             "orientation": {
 *               "z": 0.0,
 *               "w": 0.0
 *             }
 *           }
 *         }
 *         ```
 *       **Receiving Messages:**
 *       - **Get Pose:** The response will be in the following JSON format:
 *         ```json
 *         {
 *           "position": {
 *             "x": 0.0,
 *             "y": 0.0,
 *             "z": 0.0
 *           },
 *           "orientation": {
 *             "x": 0.0,
 *             "y": 0.0,
 *             "z": 0.0,
 *             "w": 0.0
 *           }
 *         }
 *         ```
 *     tags: [Websocket]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const ROSLIB = require("roslib/src/RosLib");
const AGV = require("../models/agv.model");
const Station = require("../models/station.model");
const Task = require("../models/task.model");
const Waypoint = require("../models/waypoint.model");
const Pose = require("../models/pose.model");
const moment = require("moment/moment");

const clientsByURL = {};

let _lidarConnection = null;

const broadcast = (url, message) => {
  const clients = clientsByURL[url] || [];
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

const wsRoute = (app) => {
  app.ws("/ws/lidar", (ws, req) => {
    let isBroadcasting = false;
    let currentMessage = null;

    const broadcastMessage = async () => {
      if (!isBroadcasting || !currentMessage) return;

      broadcast("dashboard-lidar", JSON.stringify(currentMessage));
      console.log("Broadcast message:", currentMessage);

      setTimeout(() => {
        broadcastMessage();
      }, 5000);
    };

    ws.on("message", (msg) => {
      try {
        const parsedMsg = JSON.parse(msg);
        console.log("Received port from ngrok:", parsedMsg);

        // Update the current message and start broadcasting if not already
        currentMessage = parsedMsg;
        if (!isBroadcasting) {
          isBroadcasting = true;
          broadcastMessage();
        }
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send("Error processing message: " + error.message);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      ws.send("WebSocket error: " + error.message);
      isBroadcasting = false;
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      isBroadcasting = false;
    });
  });

  app.ws("/ws/connect/lidar", (ws, req) => {
    let _lidarConnection;

    ws.on("message", (msg) => {
      if (_lidarConnection) return ws.send("ROSLib already connected");

      if (!msg.startsWith("ws://"))
        return ws.send("Please provide websocket address");

      ws.send("Trying to connect");

      let rosLidar = new ROSLIB.Ros({
        url: msg,
      });

      rosLidar.on("error", (error) => {
        _lidarConnection = null;
        console.error("ROSLib connection error:", error);
        ws.send("ROSLib connection error: " + error.message);
      });

      rosLidar.on("connection", () => {
        _lidarConnection = rosLidar;
        ws.send("ROSLib connection successful to ROSBRIDGE: " + msg);

        const robotPoseTopic = new ROSLIB.Topic({
          ros: rosLidar,
          name: "/goal_pose",
          messageType: "geometry_msgs/PoseStamped",
        });

        robotPoseTopic.subscribe((message) => {
          const pose = {
            position: {
              x: message.pose.position.x,
              y: message.pose.position.y,
              z: message.pose.position.z,
            },
            orientation: {
              x: message.pose.orientation.x,
              y: message.pose.orientation.y,
              z: message.pose.orientation.z,
              w: message.pose.orientation.w,
            },
          };

          ws.send(JSON.stringify(pose));
          console.log("Robot pose:", pose);
        });

        ws.on("message", async (msg) => {
          const joyTopic = new ROSLIB.Topic({
            ros: rosLidar,
            name: "/joy",
            messageType: "sensor_msgs/Joy",
          });

          // const robotPoseTopic = new ROSLIB.Topic({
          //   ros: rosLidar,
          //   name: "/robot_pose",
          //   messageType: "geometry_msgs/Pose",
          // });

          // const goalTopic = new ROSLIB.Topic({
          //   ros: rosLidar,
          //   name: "/",
          //   messageType: "geometry_msgs/Pose",
          // });

          try {
            const parsedMsg = JSON.parse(msg);
            console.log(parsedMsg);

            if (
              Array.isArray(parsedMsg.axes) &&
              Array.isArray(parsedMsg.buttons)
            ) {
              const joyMsg = new ROSLIB.Message({
                header: {
                  stamp: {
                    secs: 0,
                    nsecs: 0,
                  },
                  frame_id: "",
                },
                axes: parsedMsg.axes,
                buttons: parsedMsg.buttons,
              });

              joyTopic.publish(joyMsg);
              ws.send(JSON.stringify(joyMsg));
            } else {
              ws.send("Invalid message format: axes and buttons are required");
            }

            //send pose data to robot
            if (
              parsedMsg.pose &&
              parsedMsg.pose.position &&
              parsedMsg.pose.orientation
            ) {
              const { position, orientation } = parsedMsg.pose;
              const { x, y } = position;
              const { z, w } = orientation;

              const poseMsg = new ROSLIB.Message({
                header: { frame_id: "map" },
                pose: { position: { x, y }, orientation: { z, w } },
              });

              robotPoseTopic.publish(poseMsg);
              ws.send(JSON.stringify(poseMsg));
            } else {
              ws.send("give a right coordinates");
            }
          } catch (error) {
            console.error("Error processing message:", error);
            ws.send("Error processing message: " + error.message);
          }
          broadcast("/ws/connect/lidar", msg);
        });

        rosLidar.on("close", () => {
          _lidarConnection = null;
          ws.send("ROSLib connection closed");
        });
      });
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      ws.send("WebSocket error: " + error.message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (_lidarConnection) {
        _lidarConnection.close();
        _lidarConnection = null;
      }
    });
  });

  app.ws("/ws/task/:type", async (ws, req) => {
    const { type } = req.params;
    url = "task-" + type;

    if (!clientsByURL[url]) {
      clientsByURL[url] = [];
    }
    clientsByURL[url].push(ws);

    if (ws.readyState === ws.OPEN) {
      const today = moment().startOf("day");

      let tasks = await Task.find({
        "agv.type": type,
        time_start: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      });

      ws.send(JSON.stringify(tasks));
    }

    ws.on("open", async (msg) => {});

    ws.on("close", () => {
      clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
    });
  });

  app.ws("/ws/dashboard/:type", (ws, req) => {
    const { type } = req.params;
    url = "dashboard-" + type;

    if (!clientsByURL[url]) {
      clientsByURL[url] = [];
    }
    clientsByURL[url].push(ws);

    ws.on("message", (msg) => {
      broadcast(type, msg);
    });

    ws.on("close", () => {
      clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
    });
  });

  app.ws("/ws/:url", (ws, req) => {
    const { url } = req.params;

    if (!clientsByURL[url]) {
      clientsByURL[url] = [];
    }
    clientsByURL[url].push(ws);

    ws.on("message", (msg) => {
      try {
        let res = JSON.parse(msg);

        if (res["payload"]) updateTask(res["payload"], url);
        else broadcast(`dashboard-${url}`, res);
      } catch (e) {
        console.log("AWD");
      }
    });

    ws.on("close", () => {
      clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
    });
  });
};

async function updateTask(rfid, type) {
  console.log("masuk");
  let agv = await AGV.findOne({ type: type });
  let newStation = await Station.findOne({ rfid: rfid });

  console.log("nyari agv");

  if (!agv || !newStation) return;
  console.log("agv ketemu");
  let task = await Task.findOne({ station_to: null, agv: agv });
  console.log("nyari task");

  if (task) {
    console.log("task ketemu");
    task.station_to = newStation;
    task.time_end = Date.now();
    task.save();
  } else {
    console.log("ga ketemu");
    await Task.create({
      agv: agv,
      station_from: newStation,
      time_start: Date.now(),
    });
  }
}

async function startWaypoint(waypointId) {
  try {
    const waypoint = await Waypoint.findById(waypointId);
    if (!waypoint) {
      console.log("Waypoint not found");
      return;
    }

    if (waypoint.status === "Unexecuted") {
      const otherWaypoints = await Waypoint.find({
        status: "On Process",
        time_start: new Date(),
        _id: { $ne: waypointId },
      });
      if (otherWaypoints.length > 0) {
        await Promise.all(
          otherWaypoints.map(async (otherWaypoint) => {
            otherWaypoint.status = "Pending";
            await otherWaypoint.save();
            console.log("Waypoint status changed:", otherWaypoint);
          })
        );
      }
      waypoint.status = "On Process";
      await waypoint.save();
      console.log("Waypoint started:", waypoint);
    } else {
      console.log("Waypoint already executed or in process");
    }
  } catch (error) {
    console.error("Error starting waypoint:", error);
  }
}

async function updateWaypoint(data) {
  const { position, orientation } = data;
  const { x, y } = position;
  const { z, w } = orientation;

  try {
    let waypoints = await Waypoint.find({
      "pose_to.x": x,
      "pose_to.y": y,
      "pose_to.z": z,
      "pose_to.w": w,
      status: "On Process",
    });

    if (waypoints.length > 0) {
      const waypoint = waypoints[0];
      console.log("waypoint ketemu:", waypoint);

      waypoint.status = "Finished";
      waypoint.time_end = new Date();
      await waypoint.save();

      console.log("waypoint dah selesai:", waypoint);
      broadcast("/ws/connect/lidar", JSON.stringify({ waypoint }));
    } else {
      console.log("waypoint ga ketemu");
    }
  } catch (error) {
    console.error("Error finding/updating waypoints:", error);
  }
}

module.exports = { broadcast, wsRoute };
