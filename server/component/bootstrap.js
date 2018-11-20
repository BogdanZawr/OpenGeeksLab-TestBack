import path from 'path';
import fs from 'fs';
import koaRouter from 'koa-router';
import { Schema } from 'mongoose';
import * as _ from 'lodash';

import config from '../config';
import db from './db';

let _parse = (initPath, callback) => {

  fs.readdirSync(initPath).forEach((name) => {

    let itemPath = path.join(initPath, name)
      , stat = fs.statSync(itemPath);

    if (stat && stat.isDirectory(itemPath)) {
      _parse(itemPath, callback);

    } else {
      callback(itemPath);
    }

  });
}

class Bootstrap {
  constructor() {
    this.models();
    this.events();
  }

  routes(application) {
    if (fs.existsSync(path.join(__dirname, '..', 'route'))) {
      _parse(path.join(__dirname, '..', 'route'), (itemPath) => {
        let router = require(itemPath);
        for (let i in router) {
          if (router[i] instanceof koaRouter) {
            application
              .use(router[i].routes())
              .use(router[i].allowedMethods());
          }
        }
      });
    }
  }

  events() {
    if (fs.existsSync(path.join(__dirname, '..', 'event'))) {
      _parse(path.join(__dirname, '..', 'event'), (itemPath, name) => {
        require(itemPath);
      });
    }
  }

  models() {
    const models = {};

    _.each(config.mongoConnectionStrings, (connectionString, dbName) => {
      const dir = path.join(__dirname, '..', 'db', dbName);
      models[dbName] = models[dbName] || {};

      if (fs.existsSync(dir)) {
        const stat = fs.statSync(dir);

        if (stat && stat.isDirectory(dir)) {
          fs.readdirSync(dir).forEach((fileName) => {
            const name = path.basename(fileName, path.extname(fileName));

            let schema = require(path.join(__dirname, '..', 'db', dbName, fileName));

            for (let i in schema) {
              if (schema[i] instanceof Schema) {
                if (i === 'default') {
                  models[dbName][name] = schema[i];
                } else {
                  models[dbName][i] = schema[i];
                }
              }
            }
          });
        }
      }
    });

    db.createCollection(models);
  }
}

export default new Bootstrap()
