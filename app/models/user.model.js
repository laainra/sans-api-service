/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string 
 *       example:
 *         name: qaz
 *         username: qaz
 *         password: qaz
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);


module.exports = User;
