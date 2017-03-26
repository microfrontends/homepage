const express = require('express');
const server = express();
const proxy = require('http-proxy-middleware');

server.set('view engine', 'ejs');

server.get('/', (req, res) => res.render('index'));

server.use('*', proxy({
  target: 'https://microfrontends.herokuapp.com',
  changeOrigin: true
}));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Homepage listening on port ${port}`);
});
