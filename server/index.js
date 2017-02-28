import koa from "koa";
import {boot as bootstrap} from "./component/bootstrap";
import staticFile from 'koa-static';
import path from 'path';
import validate from 'koa-validate';
import body from 'koa-body';

const app = koa();

validate(app);

app.use(body({
	multipart: true ,
	formidable: {
		keepExtensions: true
	}
}));


app.use(staticFile(path.join(__dirname, '/../client')));

// app.use(function *(next){
//   console.log('m1');
//   yield next;
//   console.log('m5');
// });



bootstrap.routes(app);
bootstrap.events();


app.listen(5000, function() {
  console.log([new Date(), 'Server started on', 5000].join(' '));
});

