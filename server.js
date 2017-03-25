const express = require('express');
const server = express();
const request = require('request');
const proxy = require('http-proxy-middleware');

server.set('view engine', 'ejs');

const createProxy = (path, target) =>
  server.use(path, proxy({ target, changeOrigin: true, pathRewrite: {[`^${path}`]: ''} }));

createProxy('/header', 'https://microfrontends-header.herokuapp.com/');
createProxy('/products-list', 'https://microfrontends-products-list.herokuapp.com/');
createProxy('/cart', 'https://microfrontends-cart.herokuapp.com/');

server.get('/', (req, res) => res.render('index'));

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Homepage listening on port ${port}`);
});
