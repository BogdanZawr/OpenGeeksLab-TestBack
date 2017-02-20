import mongoose from 'mongoose';
import * as _ from 'lodash';
import util  from 'util';
import q  from 'q';
import {EventBus}  from './EventBus';

// extensions based on database type (read|write|static)
let extendMongoose = (dbType) => {
  mongoose.Model[dbType] = function() {
    let self = this;
    return {
      updateRow : (query, data, callback, options) => {
        let deferred = q.defer();
        let params = _.pick(options, 'executor');

        let Model = self,
          evtName = util.format('%s.%sUpdated', dbType, Model.modelName);

        options = options || {},

        Model.findOne(query, (err, doc) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }

          if (!doc) {
            let message = util.format('Entity from model [%s] was not found by query [%s]', Model.modelName, JSON.stringify(query));
            return callback && callback(new Error(message));
          }



          _.extend(doc, _.omit(data, '__v'));
          doc.save((err, item, affected) => {
            if (err) {
              callback && callback(err);
              return deferred.reject(err);
            }

            item = item.toObject();

            if (!_.isEmpty(params)){
              params.data = item;
              item = params;
            }

            !options.disableEvents && EventBus.emit(evtName + (options.hiddenEvents ? options.eventSuffix || 'Hidden' : ''), item);
            callback && callback(null, item, affected);
            deferred.resolve({
              item: item,
              affected: affected,
            });
          });
        });
      },

      insertRow : (entity, callback, options) => {
        let deferred = q.defer();
        let params = _.pick(options, 'executor');
        let Model = self,
          evtName = util.format('%s.%sInserted', dbType, Model.modelName);

        let doc = new Model(entity);
        doc.save((err,item, affected) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }

          item = item.toObject();
          if (!_.isEmpty(params)){
            params.data = item;
            item = params;
          }
          EventBus.emit(evtName, item);
          callback && callback(null, item, affected);
          deferred.resolve({
            item: item,
            affected: affected,
          });
        });

        return deferred.promise;
      },

      deleteRow : (query, callback, options) => {
        let deferred = q.defer();
        let params = _.pick(options, 'executor');

        let Model = self,
          evtName = util.format('%s.%sDeleted', dbType, Model.modelName);

        Model.findOne(query, (err,doc) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }

          if (!doc) {
            let message = util.format('Entity from model [%s] was not found by query [%s]', Model.modelName, JSON.stringify(query));
            return callback && callback(new Error(message));
          }

          doc.remove((err) => {
            if (err) {
              callback && callback(err);
              return deferred.reject(err);
            }
            let item = doc.toObject();

            if (!_.isEmpty(params)){
              params.data = item;
              item = params;
            }

            EventBus.emit(evtName, item);
            callback && callback(null, item);
            deferred.resolve(item);
          });
        });

        return deferred.promise;
      },

      updateRows : (query, data, options, callback) => {
        let _options = { multi : true };
        if (!callback) {
          callback = options;
          options = _options;
        }

        options = _.extend(options, _options);
        return self.update(query, data, options, callback);
      },

      deleteRows : (query, callback) => {
        return self.remove(query, callback);
      },

      countRows : (query, callback) => {
        return self.count(query, callback);
      },

      rowExists : (query, callback) => {
        let deferred = q.defer();
        self.count(query, (err,count) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }
          callback && callback(null, count > 0);
          deferred.resolve(count > 0);
        });

        return deferred.promise;
      },

      aggregateRows : (pipeline, callback) => {
        return self.aggregate(pipeline).allowDiskUse(true).exec(callback);
      },

      populate : (items, options, callback) => {
        return self.populate(items, options, callback);
      },

      findRows : (query, callback) => {
        return self.find(query).lean().exec(callback);
      },

      findRow : (query, callback) => {
        return self.findOne(query).lean().exec(callback);
      },

      findDocs : (query, callback) => {
        return self.find(query).exec(callback);
      },

      findDoc : (query, callback) => {
        return self.findOne(query).exec(callback);
      },

      findWithOptions : (query, options, callback) => {
        let deferred = q.defer();

        let Query = self.find(query);
        options = options && typeof options !== 'function' ? options : {};

        callback = callback || options,

        _.defaults(options, {
          limit: 40,
          pageNumber: 0
        });

        if (options.select) {
          Query = Query.select(options.select);
        }

        if (options.sort) {
          let sort = typeof options.sort === 'string' ? JSON.parse(options.sort) : options.sort;
          Query = Query.sort(sort || {});
        }

        let pageNumber = parseInt(options.pageNumber);
        if (pageNumber && pageNumber > 0) {
          skip = (pageNumber - 1) * options.limit;
          Query =  Query.skip(skip).limit(options.limit);
        }

        Query.lean().exec((err, results) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }

          if (!options.pageNumber) {
            return callback && callback(null, results);
          }

          self.count(query, (err,count) => {
            if (err) {
              callback && callback(err);
              return deferred.reject(err);
            }
            callback && callback(null, {
              pagesCount: Math.ceil(count / options.limit) || 1,
              results: results,
              totalCount: count
            });
            deferred.resolve( {
              pagesCount: Math.ceil(count / options.limit) || 1,
              results: results,
              totalCount: count
            });
          });
        });

        return deferred.promise;
      },

      aggregateWithOptions : (query, options, callback) => {
        let deferred = q.defer();

        callback = callback || options,
        options = options && typeof options !== 'function' ? options : {};
        let countquery  = [].concat(query, {$group :{_id:"1", count: { $sum: 1 }}});

        _.defaults(options, {
          limit: 40,
          pageNumber: 0
        });

        if (options.sort) {
          let sort = typeof options.sort === 'string' ? JSON.parse(options.sort) : options.sort;
          _.each(sort, (value, key) => {
            sort[key] = value == 'asc' ? 1 : -1;
          });
          !_.isEmpty(sort) && query.push({ $sort : sort });
        }

        let limit = parseInt(options.limit);

        if (options.pageNumber > 0) {
          query.push({ $skip :  (options.pageNumber - 1) * options.limit });
        }

        if (limit) {
          query.push({ $limit : limit });
        }


        self.aggregate(query).allowDiskUse(true).exec((err, results) => {
          if (err) {
            callback && callback(err);
            return deferred.reject(err);
          }

          if (!options.pageNumber) {
            return callback && callback(null, results);
          }

          self.aggregate(countquery).allowDiskUse(true).exec((err,count) => {
            if (err) {
              callback && callback(err);
              return deferred.reject(err);
            }

            if (!_.isEmpty(count)){
              callback && callback(null, {
                pagesCount: Math.ceil(count[0].count / options.limit) || 1,
                results: results,
                totalCount: count[0].count
              });

              return deferred.resolve( {
                pagesCount: Math.ceil(count[0].count / options.limit) || 1,
                results: results,
                totalCount: count[0].count
              });
            }

            callback && callback(null, {
              pagesCount: 0,
              results: [],
              totalCount: 0
            });

            deferred.resolve( {
              pagesCount: 0,
              results: [],
              totalCount: 0
            });
          });
        });

        return deferred.promise;
      }
    };
  };
};


export {extendMongoose}