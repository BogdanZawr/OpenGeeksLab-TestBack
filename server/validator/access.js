import {userWrite}  from "../model/write/user";
import {tokenWrite}  from "../model/write/token";
import * as _ from 'lodash';
import q  from 'q';

class ValidateAccess {

  * register (router) {
    router.checkBody('email').isEmail('Valid email is required');

    router.checkBody('password').len(5, 20 ,'Password must be between 5-20 characters long');
    router.checkBody('confirm').eq(router.request.body.password,'Confirm password mast be equals New password');

    if (router.errors) {
      throw(router.errors);
    }

    try {
      let user = yield userWrite.findRow({
        query: {
          email : router.request.body.email,
          isDeleted: false
        }
      });

      if (user && user.email ==  router.request.body.email) {
        throw({param : 'email', msg : 'There is an existing user connected to this email'});
      }

      return _.pick(router.request.body,['email','password']);
    }
    catch (err) {
      throw(err);
    }
  }

  * login (router) {
    router.checkBody('email').isEmail('Valid email is required');

    router.checkBody('password').notEmpty('Valid password is required');

    if (router.errors) {
      throw(router.errors);
    }

    try {
      let user = yield userWrite.findRow({
        query: {
          email : router.request.body.email,
          isDeleted: false
        }
      });

      if (!user) {
        throw({param : 'email', msg : 'User not found'});
      }

      if (userWrite.saltPassword(user.salt,router.request.body.password) !== user.password) {
        throw({param : 'password', msg : 'User password is not correct'});
      }

      return user;
    }
    catch (err) {
      throw(err);
    }
  }

  * refreshToken (router) {
    router.checkBody('refreshToken').notEmpty('Valid refresh token is required');

    if (router.errors) {
      throw(router.errors);
    }

    try {
      let token = yield tokenWrite.findRow({
        query: {
          token : router.request.body.refreshToken,
          expire: {
            $gt: new Date()
          }
        }
      });

      if (!token) {
        throw({param : 'refreshToken', msg : 'User not found'});
      }

      return token;
    }
    catch (err) {
      throw(err);
    }
  }


  * changePassword (router) {
    router.checkBody('oldPassword').notEmpty('Valid password is required');
    router.checkBody('password').len(5, 20 ,'Password must be between 5-20 characters long');
    router.checkBody('confirm').eq(router.request.body.password,'Confirm password mast be equals New password');

    if (router.errors) {
      throw(router.errors);
    }

    try {
      let user = yield userWrite.findRow({
        query: {
          _id : router.request.user._id,
          isDeleted: false
        }
      });

      if (!user) {
        throw({msg : 'User not found'});
      }

      if (userWrite.saltPassword(user.salt,router.request.body.oldPassword) !== user.password) {
        throw({param : 'oldPassword', msg : 'User old password is not correct'});
      }

      return _.pick(router.request.body,['password']);
    }
    catch (err) {
      throw(err);
    }
  }

}

export let validateAccess = new ValidateAccess();