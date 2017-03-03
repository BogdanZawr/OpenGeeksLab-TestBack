import {asymmetricEncryptionWrite}  from "../model/write/asymmetricEncryption";
import crypto from '../component/asymmetricEncryption';
import * as _ from 'lodash';

class Authorization {

  * getPublicKey (router) {
    let key = yield crypto.generateKey();
    let t;
    try {
      t = yield asymmetricEncryptionWrite.insertRow({
        data: {
          private: key.private,
          // public: key.public.toString('binary')
        }
      });
    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }

    let enc = yield crypto.encrypt({
      privateKey:key.private,
      message: '1234567890 test 0987654321'
    });

    let res = _.pick(t,['_id','public','createdAt']);
    res.enc = enc.toString('base64');
    res.public = key.public.n;

    router.body =  res;
  }

  * setPassword (router) {
    let res;

    try {
      let key = yield asymmetricEncryptionWrite.findRow({
        query:{
          _id: router.request.body.keyId
        }
      });

      console.log(key.private);
      console.log(router.request.body.message);

      res = yield crypto.decrypt({
        privateKey: key.private,
        message: router.request.body.message
      });

    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }

    router.body = res;
  }

}

export default  new Authorization();