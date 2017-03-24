const express = require('express');
const server = express();
const request = require('request');
const ejs = require('ejs');
const padRight = require('pad-right');

server.set('view engine', 'ejs');

server.get('/', (req, res) => {
  let appsToLoad = [
    { name: 'header', url: 'https://microfrontends-header.herokuapp.com/' },
    { name: 'productsList', url: 'https://microfrontends-products-list.herokuapp.com/' },
    { name: 'cart', url: 'https://microfrontends-cart.herokuapp.com/' }
  ]
  let previousFlushedData = '';

  const load = (piece, index) =>
    getContents(piece.url).then(data => {
      appsToLoad[index].data = data;
      flushData();
    });

  const buildDataForEjs = () =>
    appsToLoad.reduce((params, app) => {
      params[app.name] = app.data || 'PENDING';
      return params;
    }, {});

  const flushData = () => {
    const dataForEjs = buildDataForEjs();
    ejs.renderFile('views/index.ejs', dataForEjs, {}, (err, renderedHtml) => {
      if (err) throw err;

      const htmlToBeFlushed = renderedHtml.split('PENDING')[0].replace(previousFlushedData, '');

      // chunks have to have at least 4096 bytes to make sure browsers print them
      res.write(padRight(htmlToBeFlushed, 4096, ' '));
      previousFlushedData += htmlToBeFlushed;
    });
  }

  flushData();
  Promise.all(
    appsToLoad.map(load)
  ).then(() =>
    res.end()
  );
});

const getContents = (url) => new Promise((resolve, reject) => {
  request.get(url, (error, response, body) => {
    if (error) return resolve("Error loading " + url + ": " + error.message);

    return resolve(body);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Homepage listening on port ${port}`);
});
