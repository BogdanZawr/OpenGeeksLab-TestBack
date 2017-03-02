import config from '../config';
import {secretKeyWrite}  from "../model/write/secretKey";
import * as _ from 'lodash';
import aes256 from 'aes256';
import util  from 'util';
import co from 'co';

const lastKey = 0; //number of latest key

class SecretKey {

  * init () {
    let that = this;
    try {
      that.secretKeyList = yield secretKeyWrite.getLast();
    }
    catch (err) {
      let error = new Error(util.format('Unable to load a secret key: [%s]', err));
      throw error;
    }

    if (!that.secretKeyList.length) {
      yield that.generateNew();
    }

  }

  * generateNew () {
    let that = this;
    try {
      let key = yield secretKeyWrite.generateNew();

      that.secretKeyList.unshift(key);
      that.secretKeyList = _.slice(that.secretKeyList, lastKey, config.secretKey.keepCount );

      yield that.scheduleStart();
    }
    catch (err) {
      let error = new Error(util.format('Unable to generate a secret key: [%s]', err));
      throw error;
    }
  }

  * scheduleStartExec () {
    let that = this;

    yield that.generateNew();

    let oldKey = _.map(that.secretKeyList,'_id');

    yield secretKeyWrite.deleteOld(oldKey);

    _.remove(that.secretKeyList, function(n) {
      let index = _.indexOf(oldKey,n._id);
      return !~index;
    });

  }

  * scheduleStart () {
    let that = this;
    setTimeout(()=>{
        co(function*(){
          yield that.scheduleStartExec();
        })
      },config.secretKey.lifetime);
  }

  * encrypt (data) {
    let that = this;
    if (typeof data === 'object') {
      return aes256.encrypt(that.secretKeyList[lastKey].key, JSON.stringify(data));
    }
    else {
      throw 'Unable to encrypt token';
    }
  }

  * decrypt (encrypted) {
    let that = this;

    for (let i in that.secretKeyList) {
      let decrypted = aes256.decrypt(that.secretKeyList[i].key, encrypted);
      try {
        return JSON.parse(decrypted);
      }
      catch (err) {

      }
    }

    throw 'Unable to decrypt token';
  }
}

let secretKey = new SecretKey();

export default secretKey;