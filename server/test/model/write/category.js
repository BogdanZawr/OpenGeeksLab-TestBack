import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import categoryAction from '../../../action/category';

import { category } from '../../init';
import CategoryWrite from '../../../model/write/category';
import RecipeAction from '../../action/recipe';

describe('model', () => {
  describe('write', () => {
    describe('category', () => {
      let firstCategory;
      let secondCategory;
      before(async () => {
        firstCategory = await CategoryWrite.create({
          title: 'test',
          categoryId: null,
        });
        secondCategory = await CategoryWrite.create({
          title: 'test',
          categoryId: firstCategory._id,
        });
        await CategoryWrite.create({
          title: 'test',
          categoryId: secondCategory._id,
        });
        await CategoryWrite.create({
          title: 'test',
          categoryId: secondCategory._id,
        });
      });

      it('findById', async () => {
        const { _id } = category;
        const obj = await CategoryWrite.findById(_id);

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(null);
      });

      it('updateByParentId', async () => {
        const res = await CategoryWrite.updateByParentId(secondCategory._id, firstCategory._id);

        expect(res).to.have.all.keys([
          'n',
          'nModified',
          'ok',
        ]);

        expect(res.n).to.deep.equal(2);
        expect(res.nModified).to.deep.equal(2);
        expect(res.ok).to.deep.equal(1);
      });

      it('findAll', async () => {
        const arr = await CategoryWrite.findAll();
        const index = _.findIndex(arr, o => o._id.equals(firstCategory._id));

        expect(arr).to.be.an('array');
        expect(arr).to.not.be.empty;

        expect(arr[index]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(arr[index]).to.have.property('isDeleted', false);
        expect(arr[index]).to.have.property('title', 'test');
        expect(arr[index].createdAt).to.not.equal(arr[index].updatedAt);
        expect(arr[index].categoryId).to.deep.equal(null);
      });

      it('create', async () => {
        const obj = await CategoryWrite.create({
          title: 'test',
          categoryId: firstCategory,
        });

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(firstCategory._id);
      });

      it('update', async () => {
        const obj = await CategoryWrite.update(
          {
            title: 'test',
            categoryId: null,
          },
          secondCategory._id,
        );

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(null);
      });

      it('delete', async () => {
        const obj = await CategoryWrite.delete(secondCategory._id);

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', true);
        expect(obj).to.have.property('title', 'test');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(null);
      });

      it('category full info', async () => {
        const obj = await CategoryWrite.categoryFullInfo(category._id);

        expect(obj[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
          'articles',
          'recipes',
        ]);

        expect(obj[0]).to.have.property('isDeleted', false);
        expect(obj[0]).to.have.property('title', 'test');
        expect(obj[0].categoryId).to.deep.equal(null);
        expect(obj[0].articles).to.be.an('array');
        expect(obj[0].recipes).to.be.an('array');
      });
    });
  });
});
