module.exports = require('koa-router')({
  prefix: '/r'
});

module.exports.all('*', function *(next) {
  console.log ('r1');
  yield next;
  console.log ('r3');
});

module.exports.all('/d', function *(next) {
  console.log ('r2');
  this.body = 'Hello World';
});
