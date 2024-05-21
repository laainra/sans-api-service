const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./app/models");
const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const agvRoutes = require("./app/routes/agv.routes");
const stationRoutes = require("./app/routes/station.routes");
const dbConfig = require("./app/config/db.configs");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const ws = require("express-ws");
const dotenv = require("dotenv");
const swaggerConfig = require("./app/config/swagger.config");
const websocket = require("./app/ws/websocket");
const taskListener = require("./app/ws/taskListener");
const agvListener = require("./app/ws/agvListener");
const waypointListener = require("./app/ws/waypointListener");
const Task = require("./app/models/task.model");
const moment = require("moment/moment");
const taskRoutes = require("./app/routes/task.routes");
const poseRoutes = require("./app/routes/pose.routes");
const waypointRoutes = require("./app/routes/waypoint.routes");

const app = express();

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const wss = ws(app);

app.use(
  cookieSession({
    name: "agv-session",
    secret: "SANS_COOKIE_ZXNBV",
    httpOnly: true,
  })
);

const specs = swaggerJsdoc(swaggerConfig);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.get("/", (req, res) => {
  res.redirect("/docs");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${dbConfig.HOST}/${dbConfig.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    taskListener();
    agvListener();
    waypointListener(ws);
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

authRoutes(app);
userRoutes(app);
taskRoutes(app);
agvRoutes(app);
stationRoutes(app);
poseRoutes(app);
waypointRoutes(app);
websocket.wsRoute(app);