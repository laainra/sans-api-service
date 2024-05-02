const task = require("../models/task.model.js");
const moment = require("moment/moment");

exports.getTaskData = (req, res) => {
  const type = req.params.type;
  const start_date = moment(new Date(req.body.start_date)).toDate() ;
  const end_date = moment(new Date(req.body.end_date)).toDate() ;
  console.log(start_date, end_date, type);
  const today = moment().startOf('day')
  console.log(today.toDate());
  task
    .find( { "agv.type": type, time_start: { $gte: start_date, $lt: end_date } })
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

