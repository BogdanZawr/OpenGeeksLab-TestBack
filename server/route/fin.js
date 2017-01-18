let testWrite = require('../models/write/test');

module.exports = require('koa-router')({
  prefix: '/s'
});

module.exports.all('*', function *(next) {
  console.log ('s1');
  yield next;
  console.log ('s3');
});

module.exports.all('/d', function *(next) {
  console.log ('s2');
  this.body = 'Hello World';
});
