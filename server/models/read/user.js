var db = require('./../../db'),
  okay = require('okay'),
  crypto = require('crypto'),
  _ = require('lodash'),
  bcrypt = require('bcrypt-nodejs'),
  async = require('async'),
  utilsHelper = require('./../../components/helpers/utils'),
  UserRead = db.read('User');

_.extend(module.exports, UserRead);

exports.validatePassword = function(user, password) {
  try {
    var salt = user.salt ? new Buffer(user.salt, 'base64') : null;
    return salt && (user.password === crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64') || user.password === crypto.pbkdf2Sync(password, user.salt, 10000, 64).toString('base64')) || bcrypt.compareSync(password, user.password);
  } catch (err) {
    return false;
  }
};

