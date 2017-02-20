import path from 'path';
import fs from 'fs';

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

      application
        .use(router.routes())
        .use(router.allowedMethods());
        });
  }

  events (){
    _parse(path.join(__dirname, '..', 'handler'), (itemPath, name) => {
      require(itemPath);
    });
  }
}

let boot = new bootstrap()

export {boot}