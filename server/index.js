import koa from "koa";
import {boot as bootstrap} from "./component/bootstrap";
import staticFile from 'koa-static';
import path from 'path';
import validate from 'koa-validate';
import body from 'koa-body';
import config from './config';
import secretKey from './component/secretKey';
import co from 'co';
import crypto from './component/asymmetricEncryption';
import token from './component/token';

co(function*(){

  try {
    yield secretKey.init();
    yield secretKey.scheduleStart();
    yield token.scheduleStart();
  }
  catch (err) {
    console.error(err);
    return;
  }


  // let data = {
  //   timestamp: (new Date()).getTime(),
  //   id: '1111111111',
  //   role: [ 'admin' , 'manager']
  // }

  // let encrypted  = yield secretKey.encrypt(data);
  // console.log(encrypted);

  // setTimeout(()=>{
  //     co(function*(){
  //       try {
  //         let decrypted  = yield secretKey.decrypt(encrypted);
  //         console.log(decrypted);}

  //       catch (err) {
  //         console.error(err);
  //       }
  //     })
  //   },6000);


  const app = new  koa();

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


  bootstrap.sockets();


  app.listen(config.http.port, function() {
    console.log([new Date(), 'Server started on', config.http.port].join(' '));
  });
});
