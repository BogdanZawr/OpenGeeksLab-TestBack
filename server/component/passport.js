import mongoose from 'mongoose';
import passport from 'passport';
import {dbList} from '../db';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import * as _ from 'lodash';
import config from '../config';
import secretKey from './secretKey';
import co from 'co';
import q  from 'q';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export let bearerMiddleware = function *(next)  {
  let deferred = q.defer();
  passport.authenticate('bearer', (err, user, info) => {
    if (err) {
      this.body = err;
      this.status = 400;
      deferred.reject(err);
      return;
    }

    if (!user) {
      this.body = {message:"User not found", param : 'accessToken'};
      this.status = 400;
      deferred.reject(this.body);
      return;
    }

    this.request.user = user;
    deferred.resolve(user);
  })(this, null);

  try {
    yield deferred.promise;
    yield next;
  }
  catch (err) {}
}

passport.use(new BearerStrategy(
  function (token, done) {
    co(function * () {
      try {
        let tokenEnc = yield secretKey.decrypt(token);

        if (!tokenEnc || !tokenEnc._id || !tokenEnc.roles || !tokenEnc.expireTime) {
          throw('Access token is incorrect')
        }

        if (new Date(tokenEnc.expireTime) < new Date()) {
          throw('Access token is expired')
        }

        done(null, _.omit(tokenEnc,['expireTime']));
      }
      catch (err) {
        done({message: err, param : 'accessToken'}, false, {message: err, param : 'accessToken'});
      }
    });
  }
));

// passport.use(new FacebookStrategy({
//     clientID: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + config.http.port + '/auth/facebook/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     fetchUser().then(user => done(null, user))
//   }
// ));

// passport.use(new GoogleStrategy({
//     clientId: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + config.http.port + '/auth/google/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     fetchUser().then(user => done(null, user))
//   }
// ));

export default passport;