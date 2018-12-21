import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import categoryAction from '../../../action/category';

import { category } from '../../init';
import ArticleWrite from '../../../model/write/article';
import RecipeAction from '../../action/recipe';
import article from '../../../validator/article';

describe('model', () => {
  describe('write', () => {
    describe('article', () => {
      let firstArticle;
      let secondArticle;
      let categoryForUpdate;
      before(async () => {
        categoryForUpdate = await categoryAction.create({
          title: 'test',
          categoryId: null,
        })
        firstArticle = await ArticleWrite.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });
        await ArticleWrite.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });
        await ArticleWrite.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });
        secondArticle = await ArticleWrite.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: categoryForUpdate._id,
        });
      });

      it('findById', async () => {
        const { _id } = firstArticle;
        const obj = await ArticleWrite.findById(_id);

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj).to.have.property('text', 'test');
        expect(obj).to.have.property('description', 'test');
        expect(obj.createdAt).to.deep.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(category._id);
      });

      it('findByCategoryId', async () => {
        const arr = await ArticleWrite.findByCategoryId(category._id);
        const index = _.findIndex(arr, o => o._id.equals(firstArticle._id));

        expect(arr).to.be.an('array');
        expect(arr).to.not.be.empty;

        expect(arr[index]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v',
        ]);

        expect(arr[index]).to.have.property('isDeleted', false);
        expect(arr[index]).to.have.property('title', 'test');
        expect(arr[index]).to.have.property('text', 'test');
        expect(arr[index]).to.have.property('description', 'test');
        expect(arr[index].createdAt).to.deep.equal(arr[index].updatedAt);
        expect(arr[index].categoryId).to.deep.equal(category._id);
      });

      it('create', async () => {
        const obj = await ArticleWrite.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'test');
        expect(obj).to.have.property('text', 'test');
        expect(obj).to.have.property('description', 'test');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(category._id);
      });

      it('update', async () => {
        const obj = await ArticleWrite.update(
          {
            title: 'testUpdated',
            text: 'testUpdated',
            description: 'testUpdated',
            categoryId: category._id,
          },
          secondArticle._id,
        );

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', false);
        expect(obj).to.have.property('title', 'testUpdated');
        expect(obj).to.have.property('text', 'testUpdated');
        expect(obj).to.have.property('description', 'testUpdated');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(category._id);
      });

      it('delete', async () => {
        const obj = await ArticleWrite.delete(secondArticle._id);

        expect(obj).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v',
        ]);

        expect(obj).to.have.property('isDeleted', true);
        expect(obj).to.have.property('title', 'testUpdated');
        expect(obj).to.have.property('text', 'testUpdated');
        expect(obj).to.have.property('description', 'testUpdated');
        expect(obj.createdAt).to.not.equal(obj.updatedAt);
        expect(obj.categoryId).to.deep.equal(category._id);
      });

      it('deleteArray', async () => {
        const res = await ArticleWrite.deleteArray(category._id);

        expect(res).to.have.all.keys([
          'n',
          'nModified',
          'ok',
        ]);

        expect(res.n).to.deep.equal(6);
        expect(res.nModified).to.deep.equal(6);
        expect(res.ok).to.deep.equal(1);
      });
    });
  });
});
