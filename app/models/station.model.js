const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
    code: String,
    coordinate: String,
}, { collection: 'users' });

const User = mongoose.model('User', StationSchema);


module.exports = User;
