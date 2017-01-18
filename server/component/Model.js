var mongoose = require('mongoose'),
  EventBus = require('./EventBus'),
  async = require('async'),
  util = require('util'),
  okay = require('okay'),
  _ = require('lodash')

// extensions based on database type (read|write|static)
module.exports.extendMongoose = function(dbType) {
  mongoose.Model[dbType] = function() {
    var self = this;
    return {
      updateRow : function(query, data, callback, options) {
        var params = _.pick(options, 'executor');

        var Model = self,
          options = options || {},
          evtName = util.format('%s.%sUpdated', dbType, Model.modelName);

        Model.findOne(query, okay(callback, function(doc) {
          if (!doc) {
            var message = util.format('Entity from model [%s] was not found by query [%s]', Model.modelName, JSON.stringify(query));
            return callback(new Error(message));
          }



          _.extend(doc, _.omit(data, '__v'));
          doc.save(okay(callback, function(item, affected) {
            var item = item.toObject();

            if (!_.isEmpty(params)){
              params.data = item;
              item = params;
            }

            !options.disableEvents && EventBus.emit(evtName + (options.hiddenEvents ? options.eventSuffix || 'Hidden' : ''), item);
            callback(null, item, affected);
          }));
        }));
      },

      insertRow : function(entity, callback, options) {
        var params = _.pick(options, 'executor');
        var Model = self,
          evtName = util.format('%s.%sInserted', dbType, Model.modelName);

        var doc = new Model(entity);
        doc.save(okay(callback, function(item, affected) {
          var item = item.toObject();
          if (!_.isEmpty(params)){
            params.data = item;
            item = params;
          }
          EventBus.emit(evtName, item);
          callback(null, item, affected);
        }));
      },

      deleteRow : function(query, callback, options) {
        var params = _.pick(options, 'executor');

        var Model = self,
          evtName = util.format('%s.%sDeleted', dbType, Model.modelName);

        Model.findOne(query, okay(callback, function(doc) {
          if (!doc) {
            var message = util.format('Entity from model [%s] was not found by query [%s]', Model.modelName, JSON.stringify(query));
            return callback(new Error(message));
          }

          doc.remove(okay(callback, function() {
            var item = doc.toObject();

            if (!_.isEmpty(params)){
              params.data = item;
              item = params;
            }

            EventBus.emit(evtName, item);
            callback(null, item);
          }));
        }));
      },

      updateRows : function(query, data, options, callback) {
        var _options = { multi : true };
        if (!callback) {
          callback = options;
          options = _options;
        }

        options = _.extend(options, _options);
        self.update(query, data, options, callback);
      },

      deleteRows : function(query, callback) {
        self.remove(query, callback);
      },

      countRows : function(query, callback) {
        self.count(query, callback);
      },

      rowExists : function(query, callback) {
        self.count(query, okay(callback, function(count) {
          callback(null, count > 0);
        }));
      },

      aggregateRows : function(pipeline, callback){
        self.aggregate(pipeline).allowDiskUse(true).exec(callback);
      },

      populate : function(items, options, callback) {
        self.populate(items, options, callback);
      },

      findRows : function(query, callback) {
        self.find(query).lean().exec(callback);
      },

      findRow : function(query, callback) {
        self.findOne(query).lean().exec(callback);
      },

      findDocs : function(query, callback) {
        self.find(query).exec(callback);
      },

      findDoc : function(query, callback) {
        self.findOne(query).exec(callback);
      },

      findWithOptions : function(query, options, callback) {
        var Query = self.find(query),
          callback = callback || options,
          options = options && typeof options !== 'function' ? options : {};

        _.defaults(options, {
          limit: 40,
          pageNumber: 0
        });

        if (options.select) {
          Query = Query.select(options.select);
        }

        if (options.sort) {
          var sort = typeof options.sort === 'string' ? JSON.parse(options.sort) : options.sort;
          Query = Query.sort(sort || {});
        }

        var pageNumber = parseInt(options.pageNumber);
        if (pageNumber && pageNumber > 0) {
          skip = (pageNumber - 1) * options.limit;
          Query =  Query.skip(skip).limit(options.limit);
        }

        Query.lean().exec(okay(callback, function(results) {
          if (!options.pageNumber) {
            return callback(null, results);
          }

          self.count(query, okay(callback, function(count) {
            callback(null, {
              pagesCount: Math.ceil(count / options.limit) || 1,
              results: results,
              totalCount: count
            });
          }));
        }));
      },

      aggregateWithOptions : function(query, options, callback) {
        var callback = callback || options,
          options = options && typeof options !== 'function' ? options : {};
          var countquery  = [].concat(query, {$group :{_id:"1", count: { $sum: 1 }}});

        _.defaults(options, {
          limit: 40,
          pageNumber: 0
        });

        if (options.sort) {
            var sort = typeof options.sort === 'string' ? JSON.parse(options.sort) : options.sort;
            _.each(sort, function(value, key) {
              sort[key] = value == 'asc' ? 1 : -1;
            });
            !_.isEmpty(sort) && query.push({ $sort : sort });
          }

        var limit = parseInt(options.limit);

        if (options.pageNumber > 0) {
            query.push({ $skip :  (options.pageNumber - 1) * options.limit });
          }

        if (limit) {
          query.push({ $limit : limit });
        }


        self.aggregate(query).allowDiskUse(true).exec(okay(callback, function(results) {
          if (!options.pageNumber) {
            return callback(null, results);
          }



          self.aggregate(countquery).allowDiskUse(true).exec(okay(callback, function(count) {
            if (!_.isEmpty(count)){
            return callback(null, {
              pagesCount: Math.ceil(count[0].count / options.limit) || 1,
                results: results,
                totalCount: count[0].count
            });
            }
            callback(null, results);
          }));



        }));

      }
    };
  };
};