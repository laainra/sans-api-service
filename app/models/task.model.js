const mongoose = require("mongoose");
const AGV = require("./agv.model");
const Station = require("./station.model");

const TaskSchema = new mongoose.Schema({
    agv : AGV.schema,
    station_from: Station.schema,
    station_to: Station.schema,
    time_start: Date,
    time_end: Date,
    
}, { collection: 'tasks' });

const Task = mongoose.model('Task', TaskSchema);


module.exports = Task;
