const express = require('express');
const helmet = require('helmet');

const app = express();
const { PORT = 3000 } = process.env;

//  ..........end of defining server.....
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
//  .............end of router........................
app.use(helmet());
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app runs at ${PORT}`);
});
