const router = require('express').Router();
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send(err));
};
const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      const message = `${Object.values(err.errors)
        .map((error) => error.message)
        .join(',')}`;
      if (err.name === 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'there is issue with server' });
      }
    });
};
const deleteCard = (req, res) => {
  const { name, cardId } = req.params;
  Card.deleteOne({ cardId })
    .orFail(() => {
      const error = new Error('such card not exist');
      error.status = 404;
      throw error;
    })
    .then(() => res.status(201).send({ message: `card ${name} was deleted ` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('something went wrong');
      } else {
        res.status(500).send({ message: 'there is issue with server' });
      }
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('user id not found');
      error.status = 404;
      throw error;
    })
    .then(() => {
      res.status(200).send({ message: 'card liked' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'you cant like twice' });
      } else if (err.status === 404) {
        res.status(404).send(err.message);
      } else {
        res.status(500).send('server error');
      }
    });
};
const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send({ message: 'card disliked' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
      } else if (err.status === 404) {
        res.status(404).send(err.message);
      } else {
        res.status(500).send('server error');
      }
    });
};
//  ......................end of controller ....................
router.get('/cards', getCards);
router.post('/cards', createNewCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', unlikeCard);
module.exports = router;
