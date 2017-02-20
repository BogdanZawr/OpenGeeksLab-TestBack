import send from 'koa-send';
import path from 'path';

module.exports = require('koa-router')({
  prefix: '/'
});

module.exports.get('*', function *(next) {
  console.log ('r1');
  yield send(this, path.join(__dirname, '/../client/index.html'));
  yield next;
});
