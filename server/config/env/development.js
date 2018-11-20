const hostUrl = process.env.HOST_URL || 'http://localhost:3000/';

module.exports  =  {
  hostUrl: hostUrl,
  mongoConnectionStrings: {
    write: 'mongodb://localhost:27017/base-write',
    read: 'mongodb://localhost:27017/base-read',
  },
  clientMainFile: '/apidoc/index.html',
  staticMaxAge: 0,
  mailgun: {
    mailFrom: 'base@gmail.com',
    api_key: 'key-11111111111111111111111111111111',
    domain: 'sandbox11111111111111111111111111111111.mailgun.org',
  },
};
