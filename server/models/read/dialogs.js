var db = require('./../../db'),
  _ = require('lodash'),
    DialogsRead = db.read('Dialogs');

_.extend(module.exports, DialogsRead);