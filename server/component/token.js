import secretKey from './secretKey';
import {tokenWrite}  from "../model/write/token";
import config from '../config';
import * as _ from 'lodash';
import {eventBus}  from './eventBus';

class Token {
  * genRefresh (user) {
    let that = this;

    try {
      eventBus.emit('remove-old-refresh-token');
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

    tokenData.createTime = new Date().getTime() + config.token.accessExpired;

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
          // refreshToken: yield tokenWrite.getUserToken(user._id),
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
}

let token = new Token();

eventBus.on('remove-old-refresh-token',token.removeOld);

export default token;