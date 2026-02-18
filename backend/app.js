const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const frontendPath = path.join(__dirname, "..", "frontend");
app.set("view engine", "ejs");
app.set("views", path.join(frontendPath, "views"));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(frontendPath, "public")));

const routes = require("./routes/index");
app.use("/", routes);

module.exports = app;
