import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect, assert } from 'chai';
import CategoryValidate from '../../validator/category';

import ArticleAction from '../../action/article';
import RecipeAction from '../../action/recipe';
import { log } from 'util';

describe('validator', () => {
  describe('category', () => {
    before(async function() {
    });

    describe('create', () => {
      before(async function() {
      });

      it('response have all keys', async () => {
        const create = await CategoryValidate.create({
          title: 'test',
          categoryId: null,
        });
        expect(create).to.have.all.keys([
          'title',
          'categoryId',
        ]);

        expect(create).to.have.property('title', 'test');
        expect(create.categoryId).to.deep.equal(null);
      });

      it('response pick only the right keys', async () => {
        const create = await CategoryValidate.create({
          title: 'test',
          categoryId: null,
          userId: '5c13670c07c52023cd106691',
          updatedAt: '2018-12-14T08:17:19.459Z',
          password: true,
          admin: true,
        });

        expect(create).to.have.all.keys([
          'title',
          'categoryId',
        ]);

        expect(create).to.have.property('title', 'test');
        expect(create.categoryId).to.deep.equal(null);
      });

      it('categoryId is mongoId', async () => {
        try {
          await CategoryValidate.create({
            title: 'test',
            categoryId: 'Not the mongoId',
            userId: '5c13670c07c52023cd106691',
            updatedAt: '2018-12-14T08:17:19.459Z',
            password: true,
            admin: true,
          });
        } catch (err) {
          console.log(err[0]);
          expect(err[0]).to.have.property('param', 'categoryId');
          expect(err[0]).to.have.property('message', 'categoryId is not mongoId');
        }

      });

    });
  });
});
