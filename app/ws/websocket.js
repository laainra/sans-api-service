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
          rosLidar,
          name: "/my_topic",
          messageType: "std_msgs/String",
        });

        my_topic_listener.ros = rosLidar;

        my_topic_listener.subscribe((message) => {
          broadcast("dashboard-lidar", message.data);
          ws.send("Dari ros " + message.data);
        });
      });
      rosLidar.on("error", (error) => {
        _lidarConnection = null;
        ws.send("ROSLib connection error " + error);
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
      const today = moment().startOf('day')

      let tasks = await Task.find({ "agv.type": type,time_start : {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
    }  });

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
