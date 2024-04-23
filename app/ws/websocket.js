const ROSLIB = require("roslib/src/RosLib");

const clientsByURL = {};

let _lidarConnection = null;

const broadcast =  (url, message) => {
  const clients = clientsByURL[url] || [];
  clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
          client.send(message);
      }
  });
}

const wsRoute = (app) => {
    app.ws('/ws/connect/lidar',(ws, req) => {
        ws.on('message', (msg) => {
            if(_lidarConnection) return ws.send("ROSLib already connected");

            if(!msg.startsWith("ws://")) return ws.send("Please provide websocket address");
            
            ws.send("Trying to connect");
            
            let rosLidar = new ROSLIB.Ros({
                url: msg,
            });
            
            rosLidar.on('connection', () => {
                _lidarConnection = rosLidar;
                ws.send("ROSLib connection successful");

                const my_topic_listener = new ROSLIB.Topic({
                    rosLidar,
                    name: "/my_topic",
                    messageType: "std_msgs/String",
                });

                my_topic_listener.ros = rosLidar;
                
                my_topic_listener.subscribe((message) => {
                    console.log(message.data);
                    broadcast('dashboard-lidar', message.data)
                    ws.send("Dari ros "+message.data);
                });
            });
            rosLidar.on('error', (error) => {
                _lidarConnection = null;
                console.log(error);
                ws.send("ROSLib connection error "+error);
            });
            rosLidar.on('close', () => {
                _lidarConnection = null;
                ws.send("ROSLib connection closed");
            });
        });
        ws.on('connection',() => {
            console.log("connection");
            if(_lidarConnection) ws.send("ROSLib connected");
        });

        ws.on('close', () => {
            console.log("discon");
        });
    })

    app.ws('/ws/dashboard/:type', (ws, req) => {
        const { type } = req.params;
        url = "dashboard-"+type;

        if (!clientsByURL[url]) {
            clientsByURL[url] = [];
        }
        clientsByURL[url].push(ws);
        console.log(clientsByURL);
      
        ws.on('message', (msg) => {
            broadcast(type,msg)
        });
      
        ws.on('close', () => {
            clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
        });
    });

    app.ws('/ws/:url', (ws, req) => {
        const { url } = req.params;
        
        if (!clientsByURL[url]) {
            clientsByURL[url] = [];
        }
        clientsByURL[url].push(ws);
        console.log(clientsByURL);
      
        ws.on('message', (msg) => {
            let res = JSON.parse(msg)

            if(res.type == "masuk") broadcast(`dashboard-${url}`,res.rfid)

            else broadcast(`dashboard-${url}`,msg)
        });
      
        ws.on('close', () => {
            clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
        });
    });
}

module.exports = { broadcast, wsRoute }