const task = require("../models/task.model.js");
const Agv = require("../models/agv.model.js");
const Station = require("../models/station.model.js");
const moment = require("moment/moment");

exports.getTaskDataByDate = (req, res) => {

  const type = req.params.type;
  const start_date = moment(new Date(req.body.start_date)).toDate();
  const end_date = moment(new Date(req.body.end_date)).toDate();
  console.log(start_date, end_date, type);
  const today = moment().startOf("day");
  console.log(today.toDate());
  task
    .find({ "agv.type": type, time_start: { $gte: start_date, $lt: end_date } })
    .then((task) => {
      console.log(task);
      if (!task) {
        res.status(401).json({ message: "task not found" });
      } else res.status(200).json({ message: "Success", data: task });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getAllTaskData = (req, res) => {
  task.find()
    .then((tasks) => {
      res.status(200).json({ message: "Success", data: tasks });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getTaskDataByType = (req, res) => {

  const type = req.params.type;
  task.find({"agv.type": type})
    .then((tasks) => {
      res.status(200).json({ message: "Success", data: tasks });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};


exports.insertTask = async (req, res) => {
  const agvCode = req.body.agv;
  const station_from = req.body.station_from;
  const station_to = req.body.station_to;
  const time_start = req.body.time_start;
  const time_end = req.body.time_end;

  try {

    const agv = await Agv.findOne({ code: agvCode });
    if (!agv) {
      return res.status(404).send({ message: "AGV not found" });
    }

 
    const stationFrom = await Station.findOne({ code: station_from });
    if (!stationFrom) {
      return res.status(404).send({ message: "Station from not found" });
    }


    const stationTo = await Station.findOne({ code: station_to });
    if (!stationTo) {
      return res.status(404).send({ message: "Station to not found" });
    }


    const taskData = {
      agv: {
        _id: agv._id,
        code: agv.code,
        description: agv.description,
        ip: agv.ip,
        type: agv.type,
      },
      station_from: {
        _id: stationFrom._id,
        code: stationFrom.code,
        status: stationFrom.status,
        rfid: stationFrom.rfid,
      },
      station_to: {
        _id: stationTo._id,
        code: stationTo.code,
        status: stationTo.status,
        rfid: stationTo.rfid,
      },
      time_start: time_start,
      time_end: time_end,
    };


    const createdTask = await task.create(taskData);
    res.status(201).send({ message: "Task inserted", data: createdTask });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deletetaskData = (req, res) => {
  const id = req.params.id;

  task
    .findOneAndDelete(id)
    .then((taskData) => {
      res.status(200).json({ message: "task deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
