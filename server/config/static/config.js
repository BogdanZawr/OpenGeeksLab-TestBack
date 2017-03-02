'use strict';
var hostUrl = process.env.KOA_BASE_HOST_URL;

module.exports = {
  hostUrl: hostUrl,
  secretKey: {
    keepCount: 3,
    length: 256,
    lifetime: 2000,
  // lifetime: 172800000, //1000 * 60 * 60 * 24 * 2
  },
  token:{
    accessExpired: 3600000,//1000 * 60 *  60,
    refreshExpired: 86400000,//1000 * 60 * 60 * 24
  },
  // authCode:{
  //   time: 900000//1000 * 60 * 15,
  // },
  // confirmCodeLength:5,
  // mongoConnectionStrings : {
  //   write: process.env.MONGODB_WRITE
  // }
};
