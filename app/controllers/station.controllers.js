const station = require('../models/station.model.js');
const bcrypt = require('bcrypt');

exports.getAllStationData = (req, res) => {
    station.find()
        .then(station => {
            console.log(station);
            if (!station) {
                res.status(401).json({ message: "station not found" });
            }
            else{

                res.status(200).json({ message: "Success", data:station });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.findStationData = (req, res) => {
    const id = req.params.id;

    station.findById(id)
        .then(stationData => {
            if (!stationData) {
                res.status(401).json({ message: "station not found" });
            }
            else{
                res.status(200).json({ message: "Success", data:stationData });

            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.insertStationData = async (req, res) => {
    station.create({
        code: req.body.code,
        coordinate: req.body.coordinate,
        time_departed: req.body.time_departed,
        time_arrived: req.time_arrived,
        status: req.body.status,
    }).then((station) => {
        res.send({ message: "station inserted", data: station});
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
};

exports.deleteStationData = (req, res) => {
    const id = req.params.id;
    
    station.findOneAndDelete(id)
        .then(stationData => {
            res.status(200).json({ message: "station deleted" });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.updateStationData = (req, res) => {
    const id = req.params.id;

    station.findById(id)
        .then(stationData => {
            if (!stationData) {
                res.status(401).json({ message: "station not found" });
            }
            else{
                stationData.code = req.body.code || stationData.code;
                stationData.coordinate = req.body.coordinate || stationData.coordinate;
                stationData.time_departed = req.body.time_departed || stationData.time_departed;
                stationData.time_arrived = req.body.time_arrived || stationData.time_arrived;
                stationData.status = req.body.status || stationData.status;
    
                stationData.save()
                    .then(updatedstation => {
                        res.status(200).json({ message: "station data updated successfully", data: updatedstation });
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};
