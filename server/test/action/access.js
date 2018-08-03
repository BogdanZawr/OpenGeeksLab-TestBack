import { expect } from 'chai';

import accessAction from '../../action/access';
import accessValidate from '../../validator/access';

import { user } from '../init';

let userObj;

const userObjConfirm = (userObj) => {
  expect(userObj).to.have.property('isDeleted', false);
  expect(userObj).to.have.property('email', 'test3@mail.com');
  expect(userObj).to.have.property('firstName', 'testAdmin');
  expect(userObj).to.have.property('lastName', 'testAdmin');
};

const fieldList = [
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
];

let profile;

describe('action', () => {
  describe('access', () => {
    beforeEach(() => {
      profile = {
        email: 'test2@mail.com',
        avatar: 'https://scontent.xx.fbcdn.net',
        lastName: 'test',
        firstName: 'test',
        roles: ['user'],
      };
    });

    describe('register', () => {
	    it('create user', async () => {
	    	userObj = await accessAction.register({
	    		email: 'test3@mail.com',
				  password: 'testAdmin',
				  firstName: 'testAdmin',
				  lastName: 'testAdmin',
				  roles: ['user'],
        });

        expect(userObj).to.have.all.keys(fieldList.concat([
          'accessToken',
          'refreshToken',
        ]));

        userObjConfirm(userObj);
	    });
	  });

    describe('login', () => {
	    it('login user', async () => {
	    	const res = await accessAction.login(userObj);

        expect(res).to.have.all.keys(fieldList.concat([
          'accessToken',
          'refreshToken',
        ]));

        userObjConfirm(res);
	    });
	  });

    describe('refreshToken', () => {
      it('valid', async () => {
        const token = await accessValidate.refreshToken({ refreshToken: userObj.refreshToken });
        const res = await accessAction.refreshToken(token);

        expect(res).to.have.all.keys(fieldList.concat([
          'accessToken',
        ]));

        userObjConfirm(res);
      });
    });

    describe('forgot', () => {
      it('valid', async () => {
        const res = await accessAction.forgot(user);

        expect(res).to.deep.equal({
          result: 'success',
        });
      });
    });
  });

  describe('authAccess', () => {
    describe('loginConfirm', () => {
      it('valid', async () => {
        const res = await accessAction.loginConfirm(userObj);

        expect(res).to.have.all.keys(fieldList);

        userObjConfirm(res);
      });
    });

    describe('changePassword', () => {
      it('valid', async () => {
        const res = await accessAction.changePassword('qwerty', userObj);

        expect(res).to.deep.equal({
          result: 'success',
        });
      });
    });
  });
});
