import path from 'path';
import fs from 'fs';
import koaRouter from 'koa-router';

let _parse = (initPath, callback) => {

  fs.readdirSync(initPath).forEach((name) => {

    let itemPath = path.join(initPath, name)
      , stat = fs.statSync(itemPath);

    if (stat && stat.isDirectory(itemPath)) {
      _parse(itemPath, callback);

    } else {
      callback(itemPath);
    }

  });
}

class bootstrap {
  routes(application) {
    _parse(path.join(__dirname, '..', 'route'), (itemPath) => {
      let router = require(itemPath);
      for (let i in router) {
        if (router[i] instanceof koaRouter) {
          application
            .use(router[i].routes())
            .use(router[i].allowedMethods());
        }
      }
    });
  }

  events (){
    _parse(path.join(__dirname, '..', 'event'), (itemPath, name) => {
      require(itemPath);
    });
  }
}

let boot = new bootstrap()

export {boot}