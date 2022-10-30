const router = require('express').Router();
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send(err));
};
const getProfile = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('user id not found');
      error.status = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('make sure that id format is correct');
      } else if (err.status === 404) {
        res.status(404).send(err.message);
      } else {
        res.status(500).send('server error');
      }
    });
};
const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'one ore more fields not correct' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'there is issue with server' });
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
    .then((upd) => res.status(201).send(upd))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'one ore more fields not correct' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'there is issue with server' });
      }
    });
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const me = { _id: req.user._id };
  User.findByIdAndUpdate(me, { avatar }, { new: true, runValidators: true })
    .then((upd) => res.status(201).send(upd))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'it must be a valid url' });
      } else {
        res.status(500).send({ message: 'there is issue with server' });
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
