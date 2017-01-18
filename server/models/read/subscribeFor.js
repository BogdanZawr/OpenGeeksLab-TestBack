var db = require('./../../db'),
  _ = require('lodash'),
    SubscribeForRead = db.read('SubscribeFor');

_.extend(module.exports, SubscribeForRead);