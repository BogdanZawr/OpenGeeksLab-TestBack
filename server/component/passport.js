import passport from 'koa-passport';
import q from 'q';
import * as _ from 'lodash';

import { Strategy as BearerStrategy } from 'passport-http-bearer';

import secretKey from './secretKey';
import userWrite from '../model/write/user';
import middlewareWrapper from './middlewareWrapper';

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export const bearerMiddleware = async (req, next) => {
  const deferred = q.defer();

  passport.authenticate('bearer', (err, user) => {
    if (err) {
      return deferred.reject(err);
    }

    if (!user) {
      return deferred.reject([{ message: 'User not found', param: 'accessToken' }]);
    }

    deferred.resolve(user);
  })(req, null);


  try {
    req.request.user = await deferred.promise;
    await next();
  } catch (err) {
    req.body = err;
    req.status = 400;
    middlewareWrapper.headerSet(req);
  }

};

passport.use(new BearerStrategy(
  async (token, done) => {
    let tokenEnc;
    try {
      tokenEnc = await secretKey.decrypt(token);
    } catch (err) {
      return done([{ message: err, param: 'accessToken' }]);
    }

    if (!tokenEnc || !tokenEnc._id || !tokenEnc.roles || !tokenEnc.expireTime) {
      return done([{ message: 'Access token is incorrect', param: 'accessToken' }]);
    }

    if (new Date(tokenEnc.expireTime) < new Date()) {
      return done([{ message: 'Access token is expired', param: 'accessToken' }]);
    }

    done(null, _.omit(tokenEnc, ['expireTime']));
  },
));

function tryToFind(query, done, callback, updateCallback) {
  userWrite.findRow({
    query,
    callback(err, user) {
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
            _id: user._id,
          },
          data: _.pick(user, 'identities'),
          callback(err, item, affected) {
            if (err) {
              return done(err);
            }
            done(null, user);
          },
        });
      }

      callback && callback();
    },
  });
}

const passRoles = {
  admin: {
    recipeCreate: true,
    recipeRead: true,
    recipeUpdate: true,
    recipeDelete: true,
    articleCreate: true,
    articleRead: true,
    articleUpdate: true,
    articleDelete: true,
    categoryCreate: true,
    categoryRead: true,
    categoryUpdate: true,
    categoryDelete: true,
  },
  user: {
    recipeCreate: true,
    recipeRead: true,
    recipeUpdate: true,
    recipeDelete: true,
    articleCreate: false,
    articleRead: true,
    articleUpdate: false,
    articleDelete: false,
    categoryCreate: false,
    categoryRead: true,
    categoryUpdate: false,
    categoryDelete: false,
  },
  userPlus: {
    recipeCreate: false,
    recipeRead: true,
    recipeUpdate: false,
    recipeDelete: false,
    articleCreate: true,
    articleRead: true,
    articleUpdate: true,
    articleDelete: true,
    categoryCreate: false,
    categoryRead: true,
    categoryUpdate: false,
    categoryDelete: false,
  },
};

export const rolesCheck = (operation, user) => {
  console.log(user);
  
  if (!user) {
    throw [{ param: 'authorization', message: 'You must log in' }];
  } else {
    const { roles } = user;
    for (let i = 0; i < roles.length; i++) {
      for (const key in passRoles[roles[i]]) {
        if (key == operation) {
          if (!passRoles[roles[i]][key]) {
            throw [{ param: roles, message: 'You do not have access rights' }];
          }
        }
      }
    }
  }
}

export { passport };
