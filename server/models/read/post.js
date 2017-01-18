var db = require('./../../db'),
	_ = require('lodash'),
  	PostRead = db.read('Post');

_.extend(module.exports, PostRead);