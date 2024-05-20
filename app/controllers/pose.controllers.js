const pose = require("../models/pose.model.js");
const Agv = require("../models/agv.model.js");

exports.insertPoseData = (req, res) => {
  pose
    .create({
      code: req.body.code,
      x: req.body.x,
      y: req.body.y,
      z: req.body.z,
      w: req.body.w,
    })
    .then((pose) => {
      res.send({ message: "Pose inserted", data: pose });
    })
    .catch((err) => {
      res.status(500).send({ message: "pose insert error" + err.message });
    });
};

exports.deletePoseData = (req, res) => {
  const id = req.params.id;

  pose
    .findByIdAndDelete(id)
    .then((poseData) => {
      res.status(200).json({ message: "pose deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.findPoseData = (req, res) => {
  const id = req.params.id;

  pose
    .findByIdAndDelete(id)
    .then((poseData) => {
      res.status(200).json({ message: "pose found" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.updatePoseData = (req, res) => {
  const id = req.params.id;

  pose
    .findById(id)
    .then((poseData) => {
      if (!poseData) {
        res.status(401).json({ message: "pose not found" });
      } else {
        poseData.code = req.body.code || poseData.code;
        poseData.x = req.body.x || poseData.x;
        poseData.y = req.body.y || poseData.x;
        poseData.z = req.body.z || poseData.x;
        poseData.w = req.body.w || poseData.x;

        poseData
          .save()
          .then((updatedpose) => {
            res.status(200).json({
              message: "pose data updated successfully",
              data: updatedpose,
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

exports.getAllPoseData = (req, res) => {
  pose
    .find()
    .then((pose) => {
      console.log(pose);
      if (!pose) {
        res.status(401).json({ message: "pose not found" });
      } else {
        res.status(200).json({ message: "Success", data: pose });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
