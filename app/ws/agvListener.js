const AGV = require("../models/agv.model");
const { broadcast } = require("./websocket");

module.exports = function AGVListener() {
  const changeStream = AGV.watch();

  changeStream.on("change", async (change) => {
    console.log(change.documentKey._id);

    let agv = await AGV.findById(change.documentKey._id);
    broadcast("agv-" + change.documentKey._id, JSON.stringify(agv));

    try {
      let type= null; 
      if (agv) {
        type= await AGV.find({ type: agv.type});
      }
      broadcast(agv.type, JSON.stringify(type)); 
    } catch (error) {
      console.error("Error finding AGV by type:", error);
    }
  });

  changeStream.on("error", (err) => {
    console.error("Change stream error:", err);
  });
};
