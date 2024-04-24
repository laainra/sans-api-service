/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - agv
 *         - station_from
 *         - station_to
 *         - time_start
 *         - time_end
 *       properties:
 *         agv:
 *           $ref: '#/components/schemas/AGV'
 *         station_from:
 *           $ref: '#/components/schemas/Station'
 *         station_to:
 *           $ref: '#/components/schemas/Station'
 *         time_start:
 *           type: string
 *           format: date-time
 *         time_end:
 *           type: string
 *           format: date-time
 *       example:
 *         agv: 
 *           code: qaz
 *           description: qaz
 *           ip: ws://172.29.122.58:9090
 *           type: lidar
 *         station_from: 
 *           code: ST-A
 *           status: 20.7,8.5
 *           rfid: 6363E6E3
 *         station_to: 
 *           code: ST-B
 *           status: 20.5,8.8
 *           rfid: 6463F6E3
 *         time_start: '2024-04-25T08:00:00Z'
 *         time_end: '2024-04-25T09:00:00Z'
 */


const mongoose = require("mongoose");
const AGV = require("./agv.model");
const Station = require("./station.model");

const TaskSchema = new mongoose.Schema(
  {
    agv: AGV.schema,
    station_from: Station.schema,
    station_to: Station.schema,
    time_start: Date,
    time_end: Date,
  },
  { collection: "tasks" }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
