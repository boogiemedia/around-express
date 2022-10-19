const router = require('express').Router();
const User = require('../models/user')
const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send(err));

};
const getProfile = (req, res) => {
  const { id } = req.params;
  User.findOne({id})
  .orFail(()=>{
    const error = new Error('User ID is not exist')
    error.status= 404
    throw error
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: `User ID: ${req.params.id} not found` });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
};
const createUsers = (req, res) => {
  const { name, about, avatar} =req.body
  User.create({ name, about, avatar })
  .then((newUser) => res.status(201).send(newUser))
  .catch((err) => {
    if(err.name = 'ValidationError'){
      res.status(400).send({message: "one ore more fields not correct"})
    }
    else(()=>{
      res.status(500).send({message: "there is issue with server"})
    })
  });

};
//  ......................end of controller ....................

router.get('/users', getUsers);
router.get('/users/:_id', getProfile);
router.post('/users', createUsers)

module.exports = router;
