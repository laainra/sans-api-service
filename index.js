const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./app/models");
const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const agvRoutes = require("./app/routes/agv.routes");
const stationRoutes = require("./app/routes/station.routes");
const dbConfig = require("./app/config/db.configs");
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerWs = require('express-ws');
const dotenv = require("dotenv");
const swaggerConfig = require("./app/config/swagger.config");

const app = express();

dotenv.config()

var corsOptions = {
  origin: "http://localhost:5174",
};

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

swaggerWs(app);

app.use(
  cookieSession({
      name: "agv-session",
      secret: "SANS_COOKIE_ZXNBV",
      httpOnly: true
  })
);

const specs = swaggerJsdoc(swaggerConfig);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get("/", (req, res) => {
  res.redirect('/docs')
});

app.ws('/echo', function(ws, req) {
  console.log("Got websocket connection")
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${dbConfig.HOST}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

authRoutes(app);
userRoutes(app);
agvRoutes(app);
stationRoutes(app);