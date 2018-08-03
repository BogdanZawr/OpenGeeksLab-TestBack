import secretKey from './secretKey';
import tokenWrite  from '../model/write/token';
import config from '../config';
import * as _ from 'lodash';

class Token {
  async genRefresh(user) {
    let that = this;

    return {
      refreshToken: (await tokenWrite.genNew(user)).token,
      accessToken: await that.genAccess(user)
    }
  }

  async genAccess(user) {
    let tokenData = _.pick (user, ['_id','roles']);

    tokenData.expireTime = new Date().getTime() + config.token.accessExpired;

    return await secretKey.encrypt(tokenData);
  }

  async genNewAccess(user) {
    if (config.token.refreshRegenWithAccess) {
      return await this.genRefresh (user);
    }

    return {
      accessToken: await this.genAccess (user)
    }
  }

  async removeOld() {
    try {
      await tokenWrite.deleteExpired();
    }
    catch (err) {
      console.log(err);
    }
  }

  async scheduleStart() {
    let that = this;
    setInterval(async ()=>{
        await that.removeOld();
      },config.token.refreshExpired);
  }
}

export default new Token();
