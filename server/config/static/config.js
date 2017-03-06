'use strict';
var hostUrl = process.env.KOA_BASE_HOST_URL;

module.exports = {
  hostUrl: hostUrl,
  secretKey: {
    keepCount: 3,
    length: 256,
    // lifetime: 2000,
    lifetime: 172800000, //1000 * 60 * 60 * 24 * 2
  },
  asymmetricEncryption: {
    bits: 1024, // max 2048
    exp: 65537, // max 65537
    type: 'rsa'
  },
  token:{
    accessExpired: 3600000,//1000 * 60 *  60,
    refreshExpired: 86400000,//1000 * 60 * 60 * 24
    refreshLength: 256,
    refreshRegenWithAccess: false,
  },
  accessCode: {
    lifetime: 900000, //1000 * 60 * 15,
    length: 5,
  },
  // mongoConnectionStrings : {
  //   write: process.env.MONGODB_WRITE
  // }
};
