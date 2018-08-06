import keygen from 'keygen';

module.exports = {
  mongoDBTestCollectionPrefix: keygen.url(20),
  secretKey: {
    keepCount: 3,
    length: 256,
    lifetime: 259200000, //1000 * 60 * 60 * 24 * 3
  },
  allowCrosOrigin: true,
  token:{
    // accessExpired: 3000,
    accessExpired: 86400000 * 30 * 6,//1000 * 60 *  60 * 24,
    // refreshExpired: 6000,
    refreshExpired: 172800000,//1000 * 60 * 60 * 24 * 2
    refreshLength: 256,
    refreshRegenWithAccess: false,
  },
  accessCode: {
    lifetime: 900000, //1000 * 60 * 15,
  },
  password: {
    passwordLength: 8,
    saltLength: 16,
  },
};
