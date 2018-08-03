const hostUrl = process.env.HOST_URL || '';

module.exports  =  {
  hostUrl: hostUrl,
  mongoConnectionStrings : {
    write: '',
  },
  clientMainFile: '/apidoc/index.html',
  staticMaxAge: 31104000000, //1000*60*60*24*30*12
  mailgun: {
    mailFrom: 'base@gmail.com',
    api_key: 'key-11111111111111111111111111111111',
    domain: 'sandbox11111111111111111111111111111111.mailgun.org',
  },
};
