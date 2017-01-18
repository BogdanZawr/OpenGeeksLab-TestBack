var db = require('./../../db'),
  _ = require('lodash'),
    RelationsRead = db.read('Relations');

_.extend(module.exports, RelationsRead);