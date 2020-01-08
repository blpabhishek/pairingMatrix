const express = require('express');
const app = express();

require('./router')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.log('Something went wrong while booting server :(')
  }
  console.log("Server listening at " + PORT)
});