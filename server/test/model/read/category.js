import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import categoryAction from '../../../action/category';

import * as init from '../../init';
import CategoryRead from '../../../model/read/category';
import RecipeAction from '../../action/recipe';
import recipe from '../../../model/write/recipe';

describe('model', () => {
  describe('read', () => {
    describe('breadcrums', () => {
      let firstCategory;
      let secondCategory;
      before(async () => {
        firstCategory = await CategoryRead.create({
          isDeleted: false,
          _id: mongoose.Types.ObjectId('5c1ca84fdc1fdf22be2b6e14'),
          title: 'test',
          categoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
          children: [],
          childIds: { '5c1ca84fdc1fdf22be2b6e14': true },
        });
        secondCategory = await CategoryRead.update({
          children: [{
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c1ca84fdc1fdf22be2b6e15'),
            title: 'test',
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
            children: [{
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c1ca84fdc1fdf22be2b6e14'),
              title: 'test',
              categoryId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
              children: [],
              childIds: { '5c1ca84fdc1fdf22be2b6e14': true },
            }],
            childIds: {
              '5c1ca84fdc1fdf22be2b6e15': true,
              '5c1ca84fdc1fdf22be2b6e14': true,
            },
          }],
          childIds: { '5c1ca84fdc1fdf22be2b6e14': true },
        },
        mongoose.Types.ObjectId('5c1ca84fdc1fdf22be2b6e14'));
      });

      it('findByField', async () => {
        const { _id } = firstCategory;
        const obj = await CategoryRead.findByField(_id);

        expect(obj).to.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'updatedAt',
          'createdAt',
          'children',
          'childIds',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj.createdAt).to.deep.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(null);
        expect(obj.childIds).to.deep.equal({ [firstCategory._id]: true });
      });

      it('findAll', async () => {
        const { _id } = firstCategory;
        const obj = await CategoryRead.findAll(_id);
        const index = _.findIndex(obj, o => o._id.equals(firstCategory._id));

        expect(obj).not.to.be.empty;
        expect(obj[index]).to.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'updatedAt',
          'createdAt',
          'children',
          'childIds',
          '__v',
        ]);

        expect(obj[index]).to.have.property('isDeleted', false);
        expect(obj[index]).to.have.property('title', 'test');
        expect(obj[index].createdAt).to.not.equal(obj.updatedAt);
        expect(obj[index].categoryId).to.deep.equal(null);
        expect(obj[index].childIds).to.deep.equal({ [firstCategory._id]: true });
      });

      it('update', async () => {
        expect(secondCategory).to.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'updatedAt',
          'createdAt',
          'children',
          'childIds',
          '__v',
        ]);

        expect(secondCategory).to.have.property('isDeleted', false);
        expect(secondCategory).to.have.property('title', 'test');
        expect(secondCategory.createdAt).to.not.equal(secondCategory.updatedAt);
        expect(secondCategory.categoryId).to.deep.equal(null);
        expect(secondCategory.childIds).to.deep.equal({ [secondCategory._id]: true });
      });

      it('create', async () => {
        expect(firstCategory).to.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'updatedAt',
          'createdAt',
          'children',
          'childIds',
          '__v',
        ]);

        expect(firstCategory).to.have.property('isDeleted', false);
        expect(firstCategory).to.have.property('title', 'test');
        expect(firstCategory.createdAt).to.not.equal(firstCategory.updatedAt);
        expect(firstCategory.categoryId).to.deep.equal(null);
        expect(firstCategory.childIds).to.deep.equal({ [firstCategory._id]: true });
      });

      it('delete', async () => {
        const deletedObj = await CategoryRead.delete(firstCategory._id);

        expect(deletedObj).to.have.all.keys([
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          'updatedAt',
          'createdAt',
          'children',
          'childIds',
          '__v',
        ]);

        expect(deletedObj).to.have.property('title', 'test');
        expect(deletedObj.createdAt).to.not.equal(deletedObj.updatedAt);
        expect(deletedObj.categoryId).to.deep.equal(null);
        expect(deletedObj.categoryId).to.deep.equal(null);
        expect(deletedObj.childIds).to.deep.equal({ [deletedObj._id]: true });

        const obj = await CategoryRead.findByField(firstCategory._id);

        expect(obj).to.deep.equal(null);
      });
    });
  });
});
