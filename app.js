const express = require("express");
const apiRouter = require("./routes/api");
const { routeNotFound, handle500 } = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02"];
  if (err.status) res.status(err.status).send({ msg: err.msg });

  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: err.message || "Bad Request" });
  else res.status(500).send({ msg: "Internal Server Error" });
});

app.use(handle500);

module.exports = app;
