const Waypoint = require("../models/waypoint.model.js");
const pose = require("../models/pose.model.js");
const moment = require("moment/moment");

exports.getWaypointDataByDate = (req, res) => {
  const start_date = moment(new Date(req.body.start_date)).toDate();
  const end_date = moment(new Date(req.body.end_date)).toDate();
  console.log(start_date, end_date, type);
  const today = moment().startOf("day");
  console.log(today.toDate());
  Waypoint.find({ time_start: { $gte: start_date, $lt: end_date } })
    .then((Waypoint) => {
      console.log(Waypoint);
      if (!Waypoint) {
        res.status(401).json({ message: "Waypoint not found" });
      } else res.status(200).json({ message: "Success", data: Waypoint });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getAllWaypointData = (req, res) => {
  Waypoint.find()
    .then((Waypoints) => {
      res.status(200).json({ message: "Success", data: Waypoints });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.insertWaypoint = async (req, res) => {
  const pose_from = req.body.pose_from;
  const pose_to = req.body.pose_to;
  const time_start = req.body.time_start;
  const time_end = req.body.time_end;

  try {
    const poseFrom = await pose.findOne({ pose_from: pose_from });
    if (!poseFrom) {
      return res.status(404).send({ message: "pose from not found" });
    }

    const poseTo = await pose.findOne({ pose_from: pose_to });
    if (!poseTo) {
      return res.status(404).send({ message: "pose to not found" });
    }

    const WaypointData = {
      pose_from: {
        _id: poseFrom._id,
        pose_from: poseFrom.pose_from,
        x: poseFrom.x,
        y: poseFrom.y,
        z: poseFrom.z,
        w: poseFrom.w,
      },
      pose_to: {
        _id: poseTo._id,
        pose_from: poseTo.pose_from,
        x: poseFrom.x,
        y: poseFrom.y,
        z: poseFrom.z,
        w: poseFrom.w,
      },
      time_start: time_start,
      time_end: time_end,
      status: "Unexecuted",
    };

    const createdWaypoint = await Waypoint.create(WaypointData);
    res
      .status(201)
      .send({ message: "Waypoint inserted", data: createdWaypoint });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteWaypointData = (req, res) => {
  const id = req.params.id;

  Waypoint.findOneAndDelete(id)
    .then((WaypointData) => {
      res.status(200).json({ message: "Waypoint deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.updateWaypointData = (req, res) => {
  const id = req.params.id;

  Waypoint
    .findById(id)
    .then((WaypointData) => {
      if (!WaypointData) {
        res.status(401).json({ message: "Waypoint not found" });
      } else {
        WaypointData.pose_from = req.body.pose_from || WaypointData.pose_from;
        WaypointData.pose_to = req.body.pose_to || WaypointData.pose_to;
        WaypointData.status = req.body.status || WaypointData.status;

        WaypointData
          .save()
          .then((updatedWaypoint) => {
            res
              .status(200)
              .json({
                message: "Waypoint data updated successfully",
                data: updatedWaypoint,
              });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};