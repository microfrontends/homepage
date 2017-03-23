const express = require('express');
const server = express();
const request = require('request');

server.set('view engine', 'ejs');

server.get('/', (req, res) => res.render('index'));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Homepage listening on port ${port}`);
});
