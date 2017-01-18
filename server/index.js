let app = require('koa')(),
  bootstrap = require('./component/bootstrap');


// // x-response-time

// app.use(function *(next){
//   console.log('m1');
//   yield next;
//   console.log('m5');
//   // this.set('X-Response-Time', ms + 'ms');
// });

// // logger

// app.use(function *(next){
//   console.log('m2');
//   yield next;
//   console.log('m4');
// });

// // response

// app.use(function *(next){
//   console.log('m3');
//   yield next;
// });


bootstrap.routes(app);


app.listen(5000);