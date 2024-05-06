const ROSLIB = require("roslib/src/RosLib");
const AGV = require("../models/agv.model");
const Station = require("../models/station.model");
const Task = require("../models/task.model");
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
  app.ws("/ws/connect/lidar", (ws, req) => {
    ws.on("message", (msg) => {
      if (_lidarConnection) return ws.send("ROSLib already connected");

      if (!msg.startsWith("ws://"))
        return ws.send("Please provide websocket address");

      ws.send("Trying to connect");

      let rosLidar = new ROSLIB.Ros({
        url: msg,
      });

      rosLidar.on("connection", () => {
        _lidarConnection = rosLidar;
        ws.send("ROSLib connection successful");

        const my_topic_listener = new ROSLIB.Topic({
          ros: rosLidar,
          name: "/chatter",
          messageType: "std_msgs/String",
        });

        my_topic_listener.subscribe((message) => {
          broadcast("dashboard-lidar", message.data);
          ws.send("Dari ros " + message.data);
        });

        const kirimpesan = new ROSLIB.Topic({
          ros: rosLidar,
          name: "/kirimpesan",
          messageType: "std_msgs/String",
        });

        ws.on("message", (psn) => {
          const pesan = new ROSLIB.Message({
            data: psn,
          });

          kirimpesan.publish(pesan);
          console.log("Pesan terbitkan ke /kirimpesan topik:", psn);
          broadcast("dashboard-lidar", psn);
        });
      });

      rosLidar.on("error", (error) => {
        _lidarConnection = null;
        console.log("error:", error);
        ws.send("ROSLib connection error " + error);
        console.log("Cannot connect to robot");
      });

      rosLidar.on("close", () => {
        _lidarConnection = null;
        ws.send("ROSLib connection closed");
      });
    });

    ws.on("connection", () => {
      console.log("connection");
      if (_lidarConnection) ws.send("ROSLib connected");
    });

    ws.on("close", () => {
      console.log("discon");
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

  app.ws("/ws/test/:url", (ws, req) => {
    const { url } = req.params;

    if (!clientsByURL[url]) {
      clientsByURL[url] = [];
    }
    clientsByURL[url].push(ws);

    ws.on("message", (msg) => {
      broadcast(`dashboard-${url}`, msg);
    });

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
  //test

  app.ws("/ws/dashboard/robot", (ws, req) => {
    ws.on("message", (msg) => {
      console.log("Received message from dashboard:", msg);
      broadcast("connect/robot", msg);
    });
  });
};

async function updateTask(rfid, type) {
  console.log("masuk");
  let agv = await AGV.findOne({ type: type });
  let newStation = await Station.findOne({ rfid: rfid });

  console.log("nyari agv");
  // kalo ga ketemu return
  if (!agv || !newStation) return;
  console.log("agv ketemu");
  let task = await Task.findOne({ station_to: null, agv: agv });
  console.log("nyari task");
  // jadi station end
  if (task) {
    console.log("task ketemu");
    task.station_to = newStation;
    task.time_end = Date.now();
    task.save();
  }
  // jadi station start
  else {
    console.log("ga ketemu");
    await Task.create({
      agv: agv,
      station_from: newStation,
      time_start: Date.now(),
    });
  }
}

module.exports = { broadcast, wsRoute };

// test

// app.ws("/ws/connect/robot", (ws, req) => {
//   let robotConnection = null;

//   ws.on("message", (msg) => {
//     if (robotConnection) return ws.send("ROSLib already connected");

//     if (!msg.startsWith("ws://"))
//       return ws.send("Please provide websocket address");

//     ws.send("Trying to connect");

//     let rosRobot = new ROSLIB.Ros({
//       url: msg,
//     });

//     rosRobot.on("connection", () => {
//       robotConnection = rosRobot;
//       ws.send("ROSLib connection successful");

//       const cmdVelTopic = new ROSLIB.Topic({
//         ros: rosRobot,
//         name: "/cmd_vel",
//         messageType: "geometry_msgs/Twist",
//       });

//       const setSpeedService = new ROSLIB.Service({
//         ros: rosRobot,
//         name: "/set_speed",
//         serviceType: "set_speed_msgs/SetSpeed",
//       });

//       ws.on("message", (msg) => {
//         try {
//           let data = JSON.parse(msg);

//           if (data.command === "move") {
//             let twist = new ROSLIB.Message({
//               linear: {
//                 x: data.linear.x,
//                 y: data.linear.y,
//                 z: data.linear.z,
//               },
//               angular: {
//                 x: data.angular.x,
//                 y: data.angular.y,
//                 z: data.angular.z,
//               },
//             });
//             cmdVelTopic.publish(twist);
//           } else if (data.command === "set_speed") {
//             let request = new ROSLIB.ServiceRequest({
//               speed: data.speed,
//             });
//             setSpeedService.callService(request, (result) => {
//               console.log("Speed set:", result.success);
//             });
//             ws.send("speed adjusted:", speed);
//           } else if (data.command === "on") {
//             // Example of publishing a message to power on the robot
//             // Modify this according to your robot's interface
//             // For example, if there's a topic to control power: /power_control
//             const powerOnMsg = new ROSLIB.Message({ power: true });
//             powerControlTopic.publish(powerOnMsg);
//             ws.send("Robot powered on");
//           } else if (data.command === "off") {
//             // Example of publishing a message to power off the robot
//             // Modify this according to your robot's interface
//             // For example, if there's a topic to control power: /power_control
//             const powerOffMsg = new ROSLIB.Message({ power: false });
//             powerControlTopic.publish(powerOffMsg);
//             ws.send("Robot powered off");
//           }
//         } catch (error) {
//           console.error("Error processing message:", error);
//         }
//       });
//     });

//     rosRobot.on("error", (error) => {
//       robotConnection = null;
//       ws.send("ROSLib connection error " + error);
//     });

//     rosRobot.on("close", () => {
//       robotConnection = null;
//       ws.send("ROSLib connection closed");
//     });
//   });

//   ws.on("connection", () => {
//     console.log("connection");
//     if (robotConnection) ws.send("ROSLib connected");
//   });

//   ws.on("close", () => {
//     console.log("discon");
//   });
// });
