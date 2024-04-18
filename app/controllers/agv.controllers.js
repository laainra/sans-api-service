const agv = require('../models/agv.model.js');
const bcrypt = require('bcrypt');

exports.getAllAgvData = (req, res) => {
    agv.find()
        .then(agv => {
            console.log(agv);
            if (!agv) {
                res.status(401).json({ message: "agv not found" });
            }
            res.status(200).json({ message: "Success", data:agv });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.findAgvData = (req, res) => {
    const id = req.params.id;

    agv.findById(id)
        .then(agvData => {
            if (!agvData) {
                res.status(401).json({ message: "agv not found" });
            }
            res.status(200).json({ message: "Success", data:agvData });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.insertAgvData = async (req, res) => {
    agv.create({
        code: req.body.code,
        description: req.body.description,
        ip: req.body.ip,
        type: req.body.type,
    }).then((agv) => {
        res.send({ message: "AGV inserted", data: agv});
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
};

exports.deleteAgvData = (req, res) => {
    const id = req.params.id;
    
    agv.findOneAndDelete(id)
        .then(agvData => {
            res.status(200).json({ message: "AGV deleted" });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.updateAgvData = (req, res) => {
    const id = req.params.id;

    agv.findById(id)
        .then(agvData => {
            if (!agvData) {
                res.status(401).json({ message: "agv not found" });
            }

            agvData.code = req.body.code || agvData.code;
            agvData.description = req.body.description || agvData.description;
            agvData.ip = req.body.ip || agvData.ip;
            agvData.type = req.body.type || agvData.type;

            agvData.save()
                .then(updatedAgv => {
                    res.status(200).json({ message: "Agv data updated successfully", data: updatedAgv });
                })
                .catch(err => {
                    res.status(500).json({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};
