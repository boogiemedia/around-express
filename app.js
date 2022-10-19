const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();
const { PORT = 3000 } = process.env;

//  ..........end of defining server.....
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
//  .............end of router........................
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '634f307b295c5eff72c4694d',
  };

  next();
});
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
// tmp authorization

mongoose.connect('mongodb://localhost:27017/aroundb');
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app runs at ${PORT}`);
});
