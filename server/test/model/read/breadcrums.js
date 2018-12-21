import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import categoryAction from '../../../action/category';

import { category } from '../../init';
import BreadcrumsRead from '../../../model/read/breadcrums';
import RecipeAction from '../../action/recipe';

describe('model', () => {
  describe('read', () => {
    describe('breadcrums', () => {
      let firstCategory;
      let secondCategory;
      before(async () => {
        firstCategory = await BreadcrumsRead.create({
          isDeleted: false,
          breadCrums:
           [{
             isDeleted: false,
             _id: '5c1ba06aca1ea34a6382580a',
             title: 'test',
             categoryId: '5c1ba06aca1ea34a63825808',
             createdAt: '2018-12-20T14:00:10.659Z',
             updatedAt: '2018-12-20T14:00:10.659Z',
             __v: 0,
           },
           {
             isDeleted: false,
             _id: '5c1ba06aca1ea34a63825808',
             title: 'test',
             categoryId: null,
             createdAt: '2018-12-20T14:00:10.656Z',
             updatedAt: '2018-12-20T14:00:10.656Z',
             __v: 0,
           }],
          recipeId: [],
          articleId: [],
          _id: '5c1ba06aca1ea34a6382580a',
          updatedAt: '2018-12-20T14:00:10.659Z',
          createdAt: '2018-12-20T14:00:10.659Z',
          __v: 0,
        });
        secondCategory = await BreadcrumsRead.create({
          isDeleted: false,
          breadCrums:
           [{
             isDeleted: false,
             _id: '5c1ba06aca1ea34a63825808',
             title: 'test',
             categoryId: null,
             createdAt: '2018-12-20T14:00:10.656Z',
             updatedAt: '2018-12-20T14:00:10.656Z',
             __v: 0,
           }],
          recipeId: [],
          articleId: [],
          _id: '5c1ba06aca1ea34a63825808',
          updatedAt: '2018-12-20T14:00:10.659Z',
          createdAt: '2018-12-20T14:00:10.659Z',
          __v: 0,
        });
      });

      it('findById', async () => {
        const { _id } = firstCategory;
        const obj = await BreadcrumsRead.findById(_id);

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
      });

      it('update', async () => {
        const obj = await BreadcrumsRead.update(
          {
            breadcrums: [{
              isDeleted: false,
              _id: secondCategory,
              title: 'test',
              categoryId: null,
              createdAt: '2018-12-20T13:26:52.450Z',
              updatedAt: '2018-12-20T13:26:52.450Z',
              __v: 0,
            },
            {
              isDeleted: false,
              _id: firstCategory,
              title: 'test',
              categoryId: null,
              createdAt: '2018-12-20T13:26:52.450Z',
              updatedAt: '2018-12-20T13:26:52.450Z',
              __v: 0,
            }],
          },
          secondCategory._id,
        );

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj._id).to.deep.equal(secondCategory._id);
      });

      it('create', async () => {
        const obj = await BreadcrumsRead.create({
          isDeleted: false,
          breadCrums:
           [{
             isDeleted: false,
             _id: mongoose.Types.ObjectId('5c1bab21898ef14ef6dab52a'),
             title: 'test',
             categoryId: null,
             createdAt: '2018-12-20T14:00:10.656Z',
             updatedAt: '2018-12-20T14:00:10.656Z',
             __v: 0,
           }],
          recipeId: [],
          articleId: [],
          _id: mongoose.Types.ObjectId('5c1bab21898ef14ef6dab52a'),
          updatedAt: '2018-12-20T14:00:10.659Z',
          createdAt: '2018-12-20T14:00:10.659Z',
          __v: 0,
        });

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj.createdAt).to.deep.equal(obj.updatedAt);
        expect(obj.breadCrums[0]._id).to.deep.equal(mongoose.Types.ObjectId('5c1bab21898ef14ef6dab52a'));
        expect(obj._id).to.deep.equal(mongoose.Types.ObjectId('5c1bab21898ef14ef6dab52a'));
      });

      it('delete', async () => {
        const obj = await BreadcrumsRead.delete(secondCategory._id);

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj.recipeId).to.be.empty;
        expect(obj.articleId).to.be.empty;
        expect(obj.breadCrums).not.to.be.empty.and.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'createdAt',
          'updatedAt',
          '__v',
        ]);
        expect(obj._id).to.deep.equal(secondCategory._id);
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
      });

      it('findByCategoryId', async () => {
        const { _id } = firstCategory;
        const obj = await BreadcrumsRead.findByCategoryId(_id);

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);

        expect(obj.recipeId).to.be.empty;
        expect(obj.articleId).to.be.empty;

        expect(obj.breadCrums).not.to.be.empty.and.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'createdAt',
          'updatedAt',
          '__v',
        ]);
        expect(obj._id).to.deep.equal(firstCategory._id);
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
      });

      // it('updateByParentId', async () => {
      //   const res = await CategoryWrite.updateByParentId(secondCategory._id, firstCategory._id);

      //   expect(res).to.have.all.keys([
      //     'n',
      //     'nModified',
      //     'ok',
      //   ]);

      //   expect(res.n).to.deep.equal(2);
      //   expect(res.nModified).to.deep.equal(2);
      //   expect(res.ok).to.deep.equal(1);
      // });

      // it('findAll', async () => {
      //   const arr = await CategoryWrite.findAll();
      //   const index = _.findIndex(arr, o => o._id.equals(firstCategory._id));

      //   expect(arr).to.be.an('array');
      //   expect(arr).to.not.be.empty;

      //   expect(arr[index]).to.have.all.keys([
      //     'createdAt',
      //     'updatedAt',
      //     'isDeleted',
      //     '_id',
      //     'title',
      //     'categoryId',
      //     '__v',
      //   ]);

      //   expect(arr[index]).to.have.property('isDeleted', false);
      //   expect(arr[index]).to.have.property('title', 'test');
      //   expect(arr[index].createdAt).to.not.equal(arr[index].updatedAt);
      //   expect(arr[index].categoryId).to.deep.equal(null);
      // });

      // it('create', async () => {
      //   const obj = await CategoryWrite.create({
      //     title: 'test',
      //     categoryId: firstCategory,
      //   });

      //   expect(obj).to.have.all.keys([
      //     'createdAt',
      //     'updatedAt',
      //     'isDeleted',
      //     '_id',
      //     'title',
      //     'categoryId',
      //     '__v',
      //   ]);

      //   expect(obj).to.have.property('isDeleted', false);
      //   expect(obj).to.have.property('title', 'test');
      //   expect(obj.createdAt).to.not.equal(obj.updatedAt);
      //   expect(obj.categoryId).to.deep.equal(firstCategory._id);
      // });

      // it('delete', async () => {
      //   const obj = await CategoryWrite.delete(secondCategory._id);

      //   expect(obj).to.have.all.keys([
      //     'createdAt',
      //     'updatedAt',
      //     'isDeleted',
      //     '_id',
      //     'title',
      //     'categoryId',
      //     '__v',
      //   ]);

      //   expect(obj).to.have.property('isDeleted', true);
      //   expect(obj).to.have.property('title', 'test');
      //   expect(obj.createdAt).to.not.equal(obj.updatedAt);
      //   expect(obj.categoryId).to.deep.equal(null);
      // });

      // it('category full info', async () => {
      //   const obj = await CategoryWrite.categoryFullInfo(category._id);

      //   expect(obj[0]).to.have.all.keys([
      //     'createdAt',
      //     'updatedAt',
      //     'isDeleted',
      //     '_id',
      //     'title',
      //     'categoryId',
      //     '__v',
      //     'articles',
      //     'recipes',
      //   ]);

      //   expect(obj[0]).to.have.property('isDeleted', false);
      //   expect(obj[0]).to.have.property('title', 'test');
      //   expect(obj[0].categoryId).to.deep.equal(null);
      //   expect(obj[0].articles).to.be.an('array');
      //   expect(obj[0].recipes).to.be.an('array');
      // });
    });
  });
});
