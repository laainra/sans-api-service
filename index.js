const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const db = require("./app/models");
const authRoutes = require("./app/routes/auth.routes");
const dbConfig = require("./app/config/db.configs");
const bodyParser = require('body-parser');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
      name: "agv-session",
      secret: "HEXAROS_COOKIE_ZXNBV",
      httpOnly: true

  })
);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to SANS-AGV API Service." });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
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
