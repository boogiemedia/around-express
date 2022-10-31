const router = require('express').Router();
const Card = require('../models/card');
const {
  OK,
  ADD,
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../constants/statusHandler');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};
const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => res.status(ADD).send(newCard))
    .catch((err) => {
      const message = `${Object.values(err.errors)
        .map((error) => error.message)
        .join(',')}`;
      if (err.name === 'ValidationError') {
        res.status(INVALID_DATA).send({ message });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
const deleteCard = (req, res) => {
  const { name, cardId } = req.params;
  Card.deleteOne({ cardId })
    .orFail(() => {
      const error = new Error({ message: 'such card not exist' });
      error.status = NOT_FOUND;
      throw error;
    })
    .then(() => res.status(ADD).send({ message: `card ${name} was deleted ` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_DATA).send('Invalid ID was passed');
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'card not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
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
      const error = new Error({ message: 'user id not found' });
      error.status = NOT_FOUND;
      throw error;
    })
    .then(() => {
      res.status(OK).send({ message: 'card liked' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_DATA).send({ message: 'Invalid ID was passed' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'card not exist' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'server error' });
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
      res.status(OK).send({ message: 'card disliked' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_DATA).send({ message: 'Invalid ID was passed' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Invalid ID was passed' });
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
