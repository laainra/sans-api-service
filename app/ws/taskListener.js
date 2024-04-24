/**
 * @swagger
 * tags:
 *   name: Websocket
 * /ws/task-{type}:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: websocket tampil tasks agv sesuai tipe (line/lidar)
 *     tags: [Websocket]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 * /ws/agv-{id}:
 *   get:
 *     security:
 *      - Bearer: [] 
 *     summary: websocket tampil data agv sesuai id
 *     tags: [Websocket]
 *     responses:
 *       200:
 *         description: Success.
 *       403:
 *         description: Unauthenticated.
 */

const AGV = require("../models/agv.model");
const Task = require("../models/task.model");
const { broadcast } = require("./websocket");

module.exports = function taskListener(){
    const changeStream = Task.watch();

    changeStream.on('change', async (change) => {
        console.log(change);

        let task = await Task.findById(change.documentKey._id)
        
        let tasks = await Task.find({'agv.type' : task.agv.type})

        broadcast('task-'+task.agv.type, JSON.stringify(tasks));
    });
    
    changeStream.on('error', (err) => {
        console.error('Change stream error:', err);
    });
    
}