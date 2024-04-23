const AGV = require("../models/agv.model");
const { broadcast } = require("./websocket");

module.exports = function AGVListener(){
    const changeStream = AGV.watch();

    changeStream.on('change', async (change) => {
        console.log(change.documentKey._id);

        let agv = await AGV.findById(change.documentKey._id)
        broadcast('agv-'+change.documentKey._id, JSON.stringify(agv));

        let type = await AGV.find({type: agv.type})
        broadcast(agv.type, JSON.stringify(type));
    });
    
    changeStream.on('error', (err) => {
        console.error('Change stream error:', err);
    });
    
}