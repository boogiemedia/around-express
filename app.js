const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

//..........end of defining server.....
const usersRouter = require("./routes/users.js");
const cardsRouter = require("./routes/cards.js");
//.............end of router........................

app.use("/", usersRouter);
app.use("/", cardsRouter);
app.use((req,res, next)=>{
res.status(404).send({"message": "Requested resource not found"})
})
app.listen(PORT, () => {
  console.log(`app runs at ${PORT}`);
})
