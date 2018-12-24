import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import * as init from '../../init';
import BreadcrumsRead from '../../../model/read/breadcrums';

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
             _id: mongoose.Types.ObjectId('5c1ba06aca1ea34a6382580a'),
             title: 'test',
             categoryId: mongoose.Types.ObjectId('5c1ba06aca1ea34a63825808'),
             createdAt: new Date(),
             updatedAt: new Date(),
             __v: 0,
           },
           {
             isDeleted: false,
             _id: mongoose.Types.ObjectId('5c1ba06aca1ea34a63825808'),
             title: 'test',
             categoryId: null,
             createdAt: new Date(),
             updatedAt: new Date(),
             __v: 0,
           }],
          recipeId: [],
          articleId: [],
          _id: mongoose.Types.ObjectId('5c1ba06aca1ea34a6382580a'),
          updatedAt: new Date(),
          createdAt: new Date(),
          __v: 0,
        });
        secondCategory = await BreadcrumsRead.create({
          isDeleted: false,
          breadCrums:
           [{
             isDeleted: false,
             _id: mongoose.Types.ObjectId('5c1ba06aca1ea34a63825808'),
             title: 'test',
             categoryId: null,
             createdAt: new Date(),
             updatedAt: new Date(),
             __v: 0,
           }],
          recipeId: [],
          articleId: [],
          _id: mongoose.Types.ObjectId('5c1ba06aca1ea34a63825808'),
          updatedAt: new Date(),
          createdAt: new Date(),
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

      it('findByArticleId', async () => {
        const { _id } = init.article;
        const obj = await BreadcrumsRead.findByArticleId(_id);

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

        expect(obj.recipeId).not.to.be.empty;
        expect(obj.articleId).not.to.be.empty;

        expect(obj.breadCrums).not.to.be.empty.and.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'createdAt',
          'updatedAt',
          '__v',
        ]);
        expect(obj._id).to.deep.equal(init.category._id);
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
      });

      it('findByRecipeId', async () => {
        const { _id } = init.recipe;
        const obj = await BreadcrumsRead.findByRecipeId(_id);

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

        expect(obj.recipeId).not.to.be.empty;
        expect(obj.articleId).not.to.be.empty;

        expect(obj.breadCrums).not.to.be.empty.and.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'createdAt',
          'updatedAt',
          '__v',
        ]);
        expect(obj._id).to.deep.equal(init.category._id);
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
      });

      it('findManyByField', async () => {
        const { _id } = secondCategory;
        const arr = await BreadcrumsRead.findManyByField(_id);

        expect(arr[0]).to.have.all.keys([
          'isDeleted',
          'breadCrums',
          'recipeId',
          'articleId',
          '_id',
          'updatedAt',
          'createdAt',
          '__v',
        ]);


        expect(arr[0].breadCrums).not.to.be.empty.and.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'createdAt',
          'updatedAt',
          '__v',
        ]);
        expect(arr[0]._id).to.deep.equal(firstCategory._id);
        expect(arr[0].createdAt).to.deep.equal(arr[0].updatedAt);
      });
    });
  });
});
