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

co(function*(){

  try {
    yield secretKey.init();
    yield secretKey.scheduleStart();
  }
  catch (err) {
    console.error(err);
    return;
  }


  let key = yield crypto.generateKey();

  console.log(key.private);
  console.log(key.public);

  let enc = yield crypto.encrypt({
    privateKey: key.private,
    message: '1234567890 test 0987654321'
  });
  console.log(enc);

  let encStr = enc.toString('base64');

  enc = Buffer(enc, 'base64');

  console.log(enc);

  let dec = yield crypto.decrypt({
    privateKey:key.private,
    message: enc
  });
  console.log(dec.toString());





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


  bootstrap.sockets();


  app.listen(config.http.port, function() {
    console.log([new Date(), 'Server started on', config.http.port].join(' '));
  });
});
