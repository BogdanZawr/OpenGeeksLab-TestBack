import mongoose from 'mongoose';
import config from './../config';
import async from 'async';
import * as _ from 'lodash';
import * as Model from './../component/model';

import {testWriteSchema} from './write/test'
import {userWriteSchema} from './write/user'
import {tokenWriteSchema} from './write/token'
import {secretKeyWriteSchema} from './write/secretKey'

let dbList = {};
let db = {},
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

let models = {
  write: {
    test:     db.write.model('test',testWriteSchema),
    user:     db.write.model('user',userWriteSchema),
    token:     db.write.model('token',tokenWriteSchema),
    secretKey:     db.write.model('secretKey',secretKeyWriteSchema),
  },
  // read: {
  // },
  // static: {
  // }
};

// add db getters
// ex: UserWrite = db.write('User')
_.keys(db).forEach(function(dbType) {
  dbList[dbType] = function(model) {
    return models[dbType][model] ? models[dbType][model][dbType]() : null;
  };
});

dbList.isObjectId = function(token) {
  return mongoose.Types.ObjectId.isValid(token);
};

dbList.toObjectId = function(id) {
  return dbList.isObjectId(id) ? mongoose.Types.ObjectId(id) : null;
};

dbList.drop = function(callback) {
  async.each(_.toArray(db), function(connection, callback) {
    async.each(_.toArray(connection.collections), function(collection, callback) {
      collection.drop(callback);
    }, callback);
  }, callback);
};

export {dbList};