const getDataFromFile = require("../utils/getDataFromFile.js");
//.........
const path = require("path");
const usersPath = path.join(__dirname, "../data", "users.json");
const getUsers = (req, res) => {
  getDataFromFile(usersPath)
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send(err));
};
const getProfile = (req, res) => {
  getDataFromFile(usersPath)
    .then((users) => users.find((user) => user._id == req.params._id))
    .then((user) => {
      if (!user) {
      return res.status(404).send({message: `  User ID not found  ${req.params._id} id`})
      }
      return res.status(200).send(user);
    }).catch(err => res.status(500).send(err))
};
//......................end of controller ....................

const router = require("express").Router();
router.get("/users", getUsers);
router.get("/users/:_id", getProfile);

module.exports = router;
