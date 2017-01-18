'use strict';

var path = require('path'),
  nconf = require('nconf'),
  _ = require('lodash');

nconf.env().argv();

nconf.file('local', path.join(__dirname, 'static', 'config.local.json'));
nconf.file(path.join(__dirname, 'static', 'config.json'));

module.exports = _.extend({
    http: {
      port: process.env.PORT || 8000
    }
  },
  require(__dirname + '/static/config.js'),
  require(__dirname + '/env/' + (nconf.get('NODE_ENV') || 'development')),
  nconf.get() );
