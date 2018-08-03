import passport from 'koa-passport';
import q  from 'q';
import * as _ from 'lodash';

import { Strategy as BearerStrategy } from 'passport-http-bearer';

import secretKey from './secretKey';
import userWrite  from '../model/write/user';
import middlewareWrapper from './middlewareWrapper';

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

export let bearerMiddleware = async (req, next) => {
  let deferred = q.defer();

  passport.authenticate('bearer', (err, user) => {
    if (err) {
      return deferred.reject(err);
    }

    if (!user) {
      return deferred.reject([{ message:'User not found', param : 'accessToken' }]);
    }

    deferred.resolve(user);
  })(req, null);


  try {
    req.request.user = await deferred.promise;
    await next();
  }
  catch (err) {
    req.body = err;
    req.status = 400;
    middlewareWrapper.headerSet(req);
  }

}

passport.use(new BearerStrategy(
  async (token, done) => {
    let tokenEnc;
    try {
      tokenEnc = await secretKey.decrypt(token);
    }
    catch (err) {
      return done ([{ message: err, param : 'accessToken' }]);
    }

    if (!tokenEnc || !tokenEnc._id || !tokenEnc.roles || !tokenEnc.expireTime) {
      return done ([{ message: 'Access token is incorrect', param : 'accessToken' }]);
    }

    if (new Date(tokenEnc.expireTime) < new Date()) {
      return done ([{ message: 'Access token is expired', param : 'accessToken' }]);
    }

    done(null,  _.omit(tokenEnc,['expireTime']));
  }
));



function tryToFind(query, done, callback, updateCallback) {
  userWrite.findRow({
    query: query,
    callback: function(err,user) {
      if (err) {
        return done(err);
      }

      if (user) {
        if (!updateCallback) {
          return done(null, user);
        }

        updateCallback(user);
        return userWrite.update({
          query: {
            _id : user._id
          },
          data: _.pick(user, 'identities'),
          callback: function(err, item, affected) {
            if (err) {
              return done(err);
            }
            done(null, user);
          }
        });
      }

      callback && callback();
    }
  });
};


export {passport};
