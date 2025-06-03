const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
// app.use(morgan('combined'));
// app.use(morgan('tiny'));
// app.use(morgan('short'));
// app.use(morgan('common'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

// init routes
app.use("", require("./routes"));

// init error handling

module.exports = app;
