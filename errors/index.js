exports.routeNotFound = (req, res) => {
  console.log("in 404 error handler");
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
exports.handlePsqlCodes = (err, req, res, next) => {
  const psqlCodes = ["22P02", "23502", "42703"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message.split(" - ")[1] || "Bad Request" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
