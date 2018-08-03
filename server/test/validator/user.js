import { expect } from 'chai';

import userValidate from '../../validator/user';

import { user } from '../init';

describe('validator', () => {
  describe('user', () => {
    describe('update', () => {
      it('valid', async () => {
        const res = await userValidate.update({ email: 'test2@mail.com' }, { _id: user._id });

        expect(res).to.have.property('email', 'test2@mail.com');
      });

      it('fail email', async () => {
        let error;

        try {
          await userValidate.update({ email: 'testmail.com' }, { _id: user._id });
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'email', message: 'Valid email is required' }]);
      });

    });
  });
});

