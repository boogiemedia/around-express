const getDataFromFile = require("../utils/getDataFromFile.js")
const path = require("path");
const usersPath = path.join(__dirname, "../data", "cards.json");
const getCards = (req, res) => {
  getDataFromFile(usersPath)
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).send(err));
};
//......................end of controller ....................
const router =require('express').Router();
router.get('/cards', getCards)
module.exports = router;