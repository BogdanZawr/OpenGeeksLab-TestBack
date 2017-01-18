var mongoose = require('mongoose'),
    config = require('./../config'),
    // logger = require('./../components/Logger'),
    async = require('async'),
    Model = require('./../component/Model'),
    _ = require('lodash');

    mongoose.Promise = global.Promise;

var db = {},
  connect = function(connectionString, name) {
    db[name] = mongoose.createConnection(connectionString, {
      server : {
        readPreference : 'secondaryPreferred',
        socketOptions : {
          keepAlive : 1
        }
      },
      replSet : {
        rs_name : 'rs0',
        readPreference : 'secondaryPreferred',
        socketOptions : {
          keepAlive : 1
        }
      }
    });
  };

// connect to write, read and static databases
_.each(config.mongoConnectionStrings, function(connectionString, name) {
  connect(connectionString, name);

  [
    'open',
    'connecting',
    'connected',
    'disconnecting',
    'disconnected',
    'reconnected',
    'fullsetup'
  ].forEach(function(eventName) {
    db[name].on(eventName, function() {
      // logger.info('%s: Database connection %s event fired', name, eventName);
    });
  });

  // on database connection error
  db[name].on('error', function(err) {
    // logger.error('%s: Database error:', name);
    // logger.error(err);
    throw err;
  });

  // database connection has been closed
  db[name].on('close', function() {
    // logger.warn('%s: Database connection has been closed. Reconnecting...', name);
    connect(connectionString, name);
  });
});

// add wrapper methods for databases (with events) over mongoose
_.keys(db).forEach(function(dbType) {
  Model.extendMongoose(dbType);
});

var models = {
  write: {
    Test:     db.write.model('test',      require('./write/test')),
  },
  read: {
  },
  static: {
  }
};

// add db getters
// ex: UserWrite = db.write('User')
_.keys(db).forEach(function(dbType) {
  exports[dbType] = function(model) {
    return models[dbType][model] ? models[dbType][model][dbType]() : null;
  };
});

exports.isObjectId = function(token) {
  return mongoose.Types.ObjectId.isValid(token);
};

exports.toObjectId = function(id) {
  return exports.isObjectId(id) ? mongoose.Types.ObjectId(id) : null;
};

exports.drop = function(callback) {
  async.each(_.toArray(db), function(connection, callback) {
    async.each(_.toArray(connection.collections), function(collection, callback) {
      collection.drop(callback);
    }, callback);
  }, callback);
};
