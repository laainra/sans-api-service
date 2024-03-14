const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

exports.getUserData = (req, res) => {
    const userId = req.userId;
    
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(401).json({ message: "User not found" });
            }
            res.status(200).json({ message: "Success", user:user });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};

exports.updateUserData = (req, res) => {
    const userId = req.userId;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            user.name = req.body.name || user.name;
            user.username = req.body.username || user.username;
            user.password = req.body.password ? bcrypt.hashSync(req.body.password, 8) : user.password;

            user.save()
                .then(updatedUser => {
                    res.status(200).json({ message: "User data updated successfully", user: updatedUser });
                })
                .catch(err => {
                    res.status(500).json({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};
