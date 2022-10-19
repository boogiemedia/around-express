const router = require('express').Router();
const path = require('path');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(req))
    .catch((err) => res.status(400).send(err));
};
const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const{ owner } = req.user._id
  Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if ((err.name = 'ValidationError')) {
        res.status(400).send({ message: 'one ore more fields not correct' });
      } else
        () => {
          res.status(500).send({ message: 'there is issue with server' });
        };
    });
};
const deleteCard = (req, res) => {
  const { name, _id } = req.params;
  Card.deleteOne({ _id })
  .orFail(()=>{
    const error = new Error('such card not exist')
    error.status= 404
    throw error
  })
    .then((deletedCard) =>
      res.status(201).send({ message: `card ${name} was deleted ` })
    )
    .catch((err) => {
        res.status(500).send({ message: 'there is issue with server' });

    });
};
//  ......................end of controller ....................
router.get('/cards', getCards);
router.post('/cards', createNewCard);
router.delete('/cards', deleteCard);
module.exports = router;
