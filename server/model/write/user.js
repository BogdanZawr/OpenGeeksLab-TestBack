import keygen from 'keygen';
import pbkdf2 from 'pbkdf2';
import * as _ from 'lodash';

import db from '../../component/db';
import token from '../../component/token';
import config from '../../config/index';

const userWrite = db.model('write', 'user');

class UserWrite {
  hashPassword(password) {
    const salt = keygen.url(config.password.saltLength);
    return {
      salt,
      password: this.saltPassword(salt, password),
    };
  }

  saltPassword(salt, password) {
    return pbkdf2.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  }

  update({ query, data, callback }) {
    data.updatedAt = new Date();
    return userWrite.updateRow({
      query,
      data,
      callback,
    });
  }

  async newUser(data) {
    console.log(data);
    
    data.roles = data.roles || ['user'];
    const user = await userWrite.insertRow({
      data: _.assignIn(data, this.hashPassword(data.password)),
    });
    return _.assignIn(user, await token.genRefresh(user));
  }

  changePassword(_id, password) {
    const data = this.hashPassword(password);
    data.updatedAt = new Date();

    return userWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data,
    });
  }

  findByEmail(email) {
    return userWrite.findRow({
      query: {
        email,
        isDeleted: false,
      },
    });
  }

  findRow(reqest) {
    return userWrite.findRow(reqest);
  }

  findById(_id) {
    return userWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  findByRoles(role) {
    return userWrite.findRows({
      query: {
        roles: role,
        isDeleted: false,
      },
    });
  }
}

export default new UserWrite();
