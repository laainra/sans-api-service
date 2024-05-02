const task = require("../models/task.model.js");

exports.getTaskData = (req, res) => {
  const type = req.params.type;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  task
    .find( { type: type, time_start: { $gte: start_date, $lt: end_date } })
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

