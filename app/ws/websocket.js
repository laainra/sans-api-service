const ROSLIB = require("roslib/src/RosLib");
const AGV = require("../models/agv.model");
const Station = require("../models/station.model");
const Task = require("../models/task.model");

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
            try{
                let res = JSON.parse(msg)

                if(res['payload']) updateTaskLine(res['payload']);

                else broadcast(`dashboard-${url}`,res)
            }
            catch(e){
                console.log(e);
            }
        });
      
        ws.on('close', () => {
            clientsByURL[url] = clientsByURL[url].filter((client) => client !== ws);
        });
    });
}

async function updateTaskLine (rfid) {
    let agv = await AGV.findOne({type : 'line'})
    let newStation = await Station.findOne({rfid : rfid})
    
    // kalo ga ketemu return
    if(!agv || !newStation) return
    
    let task = await Task.findOne({station_to : null, agv : agv})

    // jadi station end
    if(task){
        task.station_to = newStation
        task.time_end = Date.now()
        task.save()
    }
    // jadi station start
    else{
        await Task.create({
            agv : agv,
            station_from : newStation,
            time_start : Date.now()
        })
    }
}

module.exports = { broadcast, wsRoute }