import secretKey from './secretKey';
import {tokenWrite}  from "../model/write/token";
import config from '../config';
import * as _ from 'lodash';

class Token {
  * genRefresh (user) {
    let that = this;

    try {
      return {
        refreshToken: (yield tokenWrite.genNew(user)).token,
        accessToken: yield that.genAccess(user)
      }
    }
    catch (err) {
      throw (err);
    }
  }

  * genAccess(user) {
    let tokenData = _.pick (user, ['_id','roles']);

    tokenData.expireTime = new Date().getTime() + config.token.accessExpired;

    try {
      return yield secretKey.encrypt(tokenData);
    }
    catch (err) {
      throw (err);
    }
  }

  * genNewAccess(user) {

    try {
      if (config.token.refreshRegenWithAccess) {
        return yield this.genRefresh (user);
      }
      else {
        return {
          accessToken: yield this.genAccess (user)
        }
      }
    }
    catch (err) {
      throw (err);
    }
  }

  * removeOld() {
    try {
      yield tokenWrite.deleteRows({
        query: {
          expire: {
            $lt: new Date()
          }
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  * scheduleStart () {
    let that = this;
    setTimeout(()=>{
        co(function*(){
          yield that.removeOld();
        })
      },config.token.refreshExpired);
  }
}

export default new Token();