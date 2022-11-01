const router = require('express').Router();
const User = require('../models/user');
const {
  OK,
  ADD,
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../constants/statusHandler');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};
const getProfile = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('user id not found');
      error.status = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(INVALID_DATA)
          .send({ message: 'make sure that id format is correct' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send([{ message: SERVER_ERROR_MESSAGE }]);
      }
    });
};
const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(ADD).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(INVALID_DATA)
          .send({ message: 'one ore more fields not correct' });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
const updateUser = (req, res) => {
  const { name, about } = req.body;
  const me = { _id: req.user._id };
  User.findByIdAndUpdate(
    me,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('user id not found');
      error.status = NOT_FOUND;
      throw error;
    })
    .then((upd) => res.status(ADD).send(upd))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(INVALID_DATA)
          .send({ message: 'one or more fields are incorrect' });
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA).send({ message: 'you must fill all fields' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const me = { _id: req.user._id };
  User.findByIdAndUpdate(me, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('user id not found');
      error.status = NOT_FOUND;
      throw error;
    })
    .then((upd) => res.status(ADD).send(upd))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(INVALID_DATA)
          .send({ message: 'one or more fields are incorrect' });
      } else if (err.name === 'CastError') {
        res
          .status(INVALID_DATA)
          .send({ message: 'Invalid ID was passed' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};
//  ......................end of controller ....................

router.get('/users', getUsers);
router.get('/users/:userId', getProfile);
router.post('/users', createUsers);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
