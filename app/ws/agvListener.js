const AGV = require("../models/agv.model");
const { broadcast } = require("./websocket");

module.exports = function AGVListener() {
  const changeStream = AGV.watch();

  changeStream.on("change", async (change) => {
    console.log(change.documentKey._id);

    let agv = await AGV.findById(change.documentKey._id);
    broadcast("agv-" + change.documentKey._id, JSON.stringify(agv));

    try {
      let code = null; 
      if (agv) {
        code = await AGV.find({ code: agv.code });
      }
      broadcast(agv.code, JSON.stringify(code)); 
    } catch (error) {
      console.error("Error finding AGV by code:", error);
    }
  });

  changeStream.on("error", (err) => {
    console.error("Change stream error:", err);
  });
};
