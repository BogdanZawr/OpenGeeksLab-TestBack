import koa from "koa";
import {boot as bootstrap} from "./component/bootstrap";
import body from "koa-better-body";
import staticFile from 'koa-static';
import path from 'path';
import validation from 'koa-better-validation';

const app = koa();

require('koa-qs')(app, 'extended');

app
.use(body({
  fields:true,
  multipart:true,
  jsonStrict:true
}))
.use(function * (next) {
    console.log(this.request.body)    // if buffer or text
    console.log(this.request.files)   // if multipart or urlencoded
    console.log(this.request.fields)  // if json

  yield next;
  });
// app.use(validation());

// app.use(staticFile(path.join(__dirname, '/../client')));

// app.use(function *(next){
//   console.log('m1');
//   yield next;
//   console.log('m5');
// });



bootstrap.routes(app);


app.listen(5000, function() {
  console.log([new Date(), 'Server started on', 5000].join(' '));
});

