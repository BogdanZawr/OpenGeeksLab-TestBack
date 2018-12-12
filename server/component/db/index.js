import mongoose, { Schema } from 'mongoose';
import async from 'async';
import * as _ from 'lodash';
import path from 'path';
import fs from 'fs';

import config from '../../config';
import extendMongoose from '../model';

mongoose.Promise = global.Promise;

class DBList {
  constructor() {
    this.dbList = {};
    this.db = {};
    this.models = {};

    this.checkDBSchemaExists();
    this.checkDBConnectionStringExists();

    this.connectDBList();

    _.keys(this.db).forEach((dbType) => {
      extendMongoose(dbType);
    });
  }

  checkDBSchemaExists() {
    _.each(config.mongoConnectionStrings, (connectionString, dbName) => {
      const dir = path.join(__dirname, '../..', 'db', dbName);

      if (!fs.existsSync(dir)) {
        throw(new Error(`No database schema found for: '${dbName}'. Create directory`))
      }

      const stat = fs.statSync(dir);

      if (!stat || !stat.isDirectory(dir)) {
        throw(new Error(`No database schema found for: '${dbName}'. Create directory`))
      }

      const fileList = fs.readdirSync(dir);

      for (const fileName of fileList){
        let schema = require(path.join(__dirname, '../..', 'db', dbName, fileName));

        for (let i in schema) {
          if (schema[i] instanceof Schema) {
            return;
          }
        }
      }

      throw(new Error(`No database schema found for: '${dbName}'. Create schema file`))

    });
  }

  checkDBConnectionStringExists() {
    const list = fs.readdirSync(path.join(__dirname, '../..', 'db'));

    for (const dir of list) {
      const stat = fs.statSync(path.join(__dirname, '../..', 'db', dir));

      if (stat && stat.isDirectory(dir) && !config.mongoConnectionStrings[dir]) {
        throw(new Error(`No connection strings found for: '${dir}'. Create connection strings`))
      }
    }
  }

  connectDB(connectionString, name) {
    this.db[name] = mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      poolSize: 10,
    });
  }

  connectDBList() {
    for (const name in config.mongoConnectionStrings) {
      this.connectDB(config.mongoConnectionStrings[name], name);
      [
        'open',
        'connecting',
        'connected',
        'disconnecting',
        'disconnected',
        'reconnected',
        'fullsetup'
      ].forEach((eventName) => {
        this.db[name].on(eventName, () => {
          if (config.environment === 'development' && config.LAUNCH_TYPE !== 'test') {
            console.log('Database evant', eventName);
          }
        });
      });

      this.db[name].on('error', (err) => {
        throw err;
      });

      // database connection has been closed
      this.db[name].on('close', () => {
        this.connectDB(connectionString, name);
      });
    }
  }

  createCollection(models) {
    _.keys(models).forEach((dbType) => {
      this.models[dbType] = this.models[dbType] || {};

      _.keys(models[dbType]).forEach((name) => {
        if (config.LAUNCH_TYPE === 'test') {
          this.models[dbType][name] = this.db[dbType].model(`${config.mongoDBTestCollectionPrefix}_${name}`, models[dbType][name]);
          return;
        }

        this.models[dbType][name] = this.db[dbType].model(name, models[dbType][name]);
      });
    });
  }

  isObjectId(token) {
    return mongoose.Types.ObjectId.isValid(token);
  }

  toObjectId(id) {
    return this.dbList.isObjectId(id) ? mongoose.Types.ObjectId(id) : null;
  }

  async drop() {
    for (let dbType in this.db) {
      for (let collection in this.db[dbType].collections) {
        try {
          await this.db[dbType].collections[collection].drop();
        } catch(e) {
          // console.log(this.db[dbType].collections[collection].name)
          // console.log(e)
        }
      }
    }
  }

  model(dbType, name) {
    return this.models[dbType][name] ? this.models[dbType][name][dbType]() : null;
  }
}

export default new DBList();
