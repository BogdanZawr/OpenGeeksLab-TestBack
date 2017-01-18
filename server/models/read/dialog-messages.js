var db = require('./../../db'),
  _ = require('lodash'),
    DialogMessagesRead = db.read('DialogMessages');

_.extend(module.exports, DialogMessagesRead);