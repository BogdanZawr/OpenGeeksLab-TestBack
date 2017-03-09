var hostUrl = process.env.KOA_BASE_HOST_URL || 'http://localhost:8000/';

module.exports  =  {
	hostUrl: hostUrl,
  mongoConnectionStrings : {
    write: 'mongodb://localhost:27017/koa_base-write',
    // read: 'mongodb://admin:incode2015@localhost:27017/koa_base-read',
    // static: 'mongodb://admin:incode2015@localhost:27017/koa_base-static'
  },
  redis: {
    host: 'localhost',
    port: 6379,
    prefix : 'koa_base'
  },
  facebook: {
    clientID: process.env.FACEBOOK_FREELAN_APP_ID,
    clientSecret: process.env.FACEBOOK_FREELAN_APP_SECRET,
    callbackURL: hostUrl + 'auth/facebook/callback'
  },
  google: {
    clientID: process.env.GOOGLE_FREELAN_APP_ID,
    clientSecret: process.env.GOOGLE_FREELAN_APP_SECRET,
    callbackURL: hostUrl + 'auth/google/callback'
  },
};