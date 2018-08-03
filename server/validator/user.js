import * as _ from 'lodash';
import fs from 'fs';

import userWrite from '../model/write/user';

import validator from '../component/validator';

const userFreeData = [
  '_id',
  'email',
  'firstName',
  'lastName',
];

class UserValidate {
  async update(body, user) {
    const fullValidateObj = {
      email: {
        isEmail: {
          message: 'Valid email is required',
        },
      },
      firstName: {
        notEmpty: {
          message: 'First Name is required',
        },
      },
      lastName: {
        notEmpty: {
          message: 'Last Name is required',
        },
      },
    };

    const fieldsList = [
      'email',
      'firstName',
      'lastName',
    ];

    const validateObj = {};

    for (const field of fieldsList) {
      if (!_.isUndefined(body[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    }

    let errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw (errorList);
    }

    const userObj = await userWrite.findById(user._id);

    if (!userObj) {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    return _.pick(body, userFreeData);
  }
}


export default new UserValidate();
