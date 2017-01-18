var db = require('./../../db'),
  _ = require('lodash'),
  TestWrite = db.write('Test');

_.extend(module.exports, TestWrite);
