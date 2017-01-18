'use strict';
var hostUrl = process.env.KOA_BASE_HOST_URL;

module.exports = {
  hostUrl: hostUrl,
  token:{
    secretAccessTokenKey: "large large very large secret key",
    secretRefreshTokenKey: "large large very large secret key2",
    //accessTokenExpired: 1000,
    accessTokenExpired: 3600000,//1000 * 60 *  60,
    // accessTokenExpired: 1000 * 60 *  60 * 24,
    refreshTokenExpired: 15552000000//1000 * 60 * 60 * 24 * 30 * 6,
  },
  authCode:{
    time: 1000 * 60 * 15,
  },
  confirmCodeLength:5,
  mongoConnectionStrings : {
    write: process.env.MONGODB_KOA_BASE_WRITE
  }
};
