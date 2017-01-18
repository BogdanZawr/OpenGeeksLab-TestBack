var db = require('./../../db'),
  _ = require('lodash'),
    SubscribeByRead = db.read('SubscribeBy');

_.extend(module.exports, SubscribeByRead);