import {dbList} from './../../db';
import crypto from 'crypto';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import token from '../../component/token';
export let userWrite = dbList.write('user');

userWrite.hashPassword = function (password) {
  var salt = crypto.randomBytes(16).toString('base64');
  return {
    salt : salt,
    password : this.saltPassword(salt,password)
  };
};

userWrite.saltPassword = function (salt,password) {
  return  crypto.pbkdf2Sync(password, salt, 10000, 64,'sha1').toString('base64');
}

userWrite.setСode = function * ({data, callback}) {
  data.code = Math.floor(Math.random()*100000);

  while (data.code.toString().length < config.accessCode.length){
    data.code = '0' + data.code.toString();
  }

  data.updatedAt = new Date();
  data.lastLoginTime = new Date();

  return yield this.updateRow({
      query: {_id: mongoose.Types.ObjectId(data._id)},
      data: data,
      callback: callback
    });
}


userWrite.update = function * ({request, data, callback}) {
  data.updatedAt = new Date();
  return yield this.updateRow({
      query: request,
      data: data,
      callback: callback
    });
};

userWrite.newUser = function * (data) {
  try {
    let user = yield this.insertRow({
      data: _.assignIn(data, this.hashPassword(data.password))
    });
    return _.assignIn(user, yield token.genRefresh(user));
  }
  catch (err) {
    throw(err);
  }
};

userWrite.getUserById = function * (id) {
  try {
    let user = yield this.findRow({
      query: {
        _id: id
      }
    });
    return user;
  }
  catch (err) {
    throw(err);
  }
};


userWrite.changePassword = function * (id,password) {
  let data = this.hashPassword(password);
  data.updatedAt = new Date();

  return yield this.updateRow({
      query: {
        _id: id
      },
      data: data
    });
};