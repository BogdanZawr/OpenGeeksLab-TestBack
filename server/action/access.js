import _ from 'lodash';
import keygen from 'keygen';
import q from 'q';

import userWrite from '../model/write/user';
import token from '../component/token';
import mailer from '../component/mailer';
import config from '../config';


const userFreeData = [
  'accessToken',
  'refreshToken',
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
];

class AccessAction {
  async register(data) {
    const user = await userWrite.newUser(data);

    return _.pick(user, userFreeData);
  }

  async login(user) {
    const userData = _.assignIn(user, await token.genRefresh(user));

    return _.pick(userData, userFreeData);
  }

  async loginConfirm(user) {
    const userData = await userWrite.findById(user._id);

    return _.pick(userData, userFreeData);
  }

  async refreshToken(userToken) {
    const user = await userWrite.findById(userToken.userId);
    return _.pick(_.assignIn(user, await token.genNewAccess(user)), userFreeData);
  }

  async changePassword(password, user) {
    await userWrite.changePassword(user._id, password);

    return {
      result: 'success',
    };
  }

  async forgot(user) {
    const pass = keygen.url(config.password.passwordLength);

    const userData = await userWrite.changePassword(user._id, pass);

    const deferred = q.defer();

    mailer.messages().send({
      from: config.mailgun.mailFrom,
      to: userData.email,
      subject: 'Pasword reset',
      html: `<h4>This letter was sent to your e-mail to verify the identity when changing the password.</h4>
        <p>New password: ${pass}</p>`,
    }, (err, body) => {
      if (err) {
        console.log(err);
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });

    await deferred.promise;


    return {
      result: 'success',
    };
  }
}

export default new AccessAction();
