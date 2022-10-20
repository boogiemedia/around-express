const router = require('express').Router();
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(400).send(err));
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
    .catch(() => {
      res.status(500).send({ message: 'there is issue with server' });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      res.status(200).send({ message: 'card liked' });
    })
    .catch(() => {
      res.status(400).send({ message: 'you cant like twice' });
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
    .catch(() => {
      res.status(400).send({ message: 'you cant dislike twice' });
    });
};
//  ......................end of controller ....................
router.get('/cards', getCards);
router.post('/cards', createNewCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', unlikeCard);
module.exports = router;
