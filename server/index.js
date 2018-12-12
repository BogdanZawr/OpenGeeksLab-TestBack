import Koa from 'koa';
import fs from 'fs';
import send from 'koa-send';
import path from 'path';
import body from 'koa-body';
import passport from 'koa-passport';
import os from 'os';

import config from './config';
import bootstrap from './component/bootstrap';
import secretKey from './component/secretKey';
import token from './component/token';
import start from './start';

try {
  secretKey.init();
  secretKey.scheduleStart();
  token.scheduleStart();
  start();
} catch (err) {
  console.error(err);
}

const app = new Koa();

app.use(passport.initialize());

app.use(
  body({
    multipart: true,
    formidable: {
      uploadDir: os.tmpdir(),
    },
  }));

bootstrap.routes(app);

app.use(async (req, next) => {
  if (req.req
    && req.req._parsedUrl
    && req.req._parsedUrl.pathname
    && fs.existsSync(path.join(__dirname, '/../apidoc', req.req._parsedUrl.pathname))) {
    await send(req, path.join('/../apidoc', req.req._parsedUrl.pathname));
    return;
  }

  next();
});

app.listen(config.http.port, () => {
  console.log([new Date(), 'Server started on', config.http.port].join(' '));
});
