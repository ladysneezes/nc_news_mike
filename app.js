const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handlePsqlCodes
} = require("./errors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

//app.all("/*", routeNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlCodes);
app.use(handle500);

module.exports = app;
