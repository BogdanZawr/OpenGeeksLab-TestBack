import {userWrite}  from "../model/write/user";
import {validateAccess}  from "../validator/access";
import config from '../config';
import token from '../component/token';
import * as _ from 'lodash';

let userFreeData = ["accessToken", "refreshToken", "createdAt", "updatedAt", "isDeleted", "lastLoginTime", "roles", "_id", "email"];

class Access {

  * register (router) {
    try {
      let regData = yield validateAccess.register(router);
      router.body = _.pick(yield userWrite.newUser(regData), userFreeData);
    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }
  }

  * login (router) {
    try {
      let regData = yield validateAccess.login(router);
      _.assignIn(regData,yield token.genRefresh(regData));
      router.body = _.pick(regData, userFreeData);
    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }
  }

  * loginConfirm (router) {
      let user = yield userWrite.getUserById(router.request.user._id);//--------------------------------//
      router.body =  _.pick(user, userFreeData);
  }

  * refreshToken (router) {
    try {
      let regData = yield validateAccess.refreshToken(router);
      let user = yield userWrite.getUserById(regData.userId);

      router.body =  _.pick(_.assignIn(user, yield token.genNewAccess(user)), userFreeData);
    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }
  }

}

export default  new Access();