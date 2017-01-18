var db = require('./../../db'),
  _ = require('lodash'),
    ViolationsStatic = db.static('Violations');

_.extend(module.exports, ViolationsStatic);