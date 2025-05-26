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

// init database
require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

// init routes
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

// init error handling

module.exports = app;
