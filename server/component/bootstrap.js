let path = require('path')
  , fs = require('fs');

let _parse = (initPath, callback) => {

  fs.readdirSync(initPath).forEach((name) => {

    var itemPath = path.join(initPath, name)
      , stat = fs.statSync(itemPath);

    if (stat && stat.isDirectory(itemPath)) {
      _parse(itemPath, callback);

    } else {
      callback(itemPath);
    }

  });
}

module.exports = {
  routes : (application) => {
    _parse(path.join(__dirname, '..', 'route'), (itemPath) => {
      let router = require(itemPath);

      application
        .use(router.routes())
        .use(router.allowedMethods());
        });
  },
  events : () => {
    _parse(path.join(__dirname, '..', 'handlers'), (itemPath, name) => {
      require(itemPath);
    });
  }
}