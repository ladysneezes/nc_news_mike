const { fetchUserByUsername } = require("../models/users");

exports.sendUser = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for username: ${req.params.username}`
        });
      }
      res.status(200).send({ user });
    })
    .catch(err => {
      next(err);
    });
};
