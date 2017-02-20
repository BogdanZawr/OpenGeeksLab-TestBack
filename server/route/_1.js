import {Test}  from "../action/test";

let test = new Test();

module.exports = require('koa-router')({
  prefix: '/r'
});

module.exports.post('*', function *(next) {
  console.log ('r1');
  yield next;
  console.log ('r5');
});

module.exports.post('/d', function *(next) {
    // yield this.validateBody({
    //     name     : 'required|minLength:4'
    // });

    // if (this.validationErrors) {
    //   this.status = 422;
    //   this.body = this.validationErrors;
    //   return;
    // }
  console.log ('r2');
  yield test.test(this,next);
  console.log ('r3');
  yield next;
  console.log ('r4');
});
