import {dbList} from './../../db';
import keygen from 'keygen';
import config from '../../config';

export let tokenWrite = dbList.write('token');

tokenWrite.genNew = function * (user) {
  try {
    return yield tokenWrite.insertRow({
      data: {
        token: keygen.url(config.token.refreshLength),
        userId: user._id,
        expire: new Date(new Date().getTime() + config.token.refreshExpired)
      }
    });
  }
  catch (err) {
    throw (err);
  }
};

tokenWrite.getUserToken = function * (id) {
  try {
    return (yield tokenWrite.findRow({
      query: {
        userId: id
      }
    })).token;
  }
  catch (err) {
    throw (err);
  }
};