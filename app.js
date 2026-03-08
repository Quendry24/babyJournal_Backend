require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var nounouRouter = require("./routes/nounou");
//var usersRouter = require("./routes/users");
var parentsRouter = require("./routes/parents");
var enfantsRouter = require("./routes/enfants");

const fileUpload = require("express-fileupload");
var app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(fileUpload());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/nounou", nounouRouter);
app.use("/parents", parentsRouter);
app.use("/enfants", enfantsRouter);

module.exports = app;
