import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect, assert } from 'chai';
import categoryAction from '../../action/category';

import ArticleAction from '../../action/article';
import { log } from 'util';

describe('action', () => {
  describe('article', () => {
    let category;
    let article;
    let categoryForUpdate;
    before(async function() {
      category = await categoryAction.create({
        title: 'testCategoryForArticle',
        categoryId: null
      });
      categoryForUpdate = await categoryAction.create({
        title: 'testCategoryForArticle',
        categoryId: null
      });
      article = await ArticleAction.create({
        title: 'test',
        text: 'test',
        description: 'test',
        categoryId: category._id
      });
    });
    describe('create', () => {
      before(async function() {});

      it('article have all keys', async () => {
        expect(article).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(article).to.have.property('isDeleted', false);
        expect(article).to.have.property('title', 'test');
        expect(article.createdAt).to.deep.equal(article.updatedAt);
        expect(article.categoryId).to.deep.equal(category._id);
      });
    });
    describe('update', () => {
      let updateArticle;
      let updateCategoryId;
      before(async function() {
        let updatedArticle = await ArticleAction.update({
          data: { title: 'testUpdated' },
          _id: article._id
        });
        updateArticle = _.cloneDeep(updatedArticle);
        updateCategoryId = await ArticleAction.update({
          data: {
            title: 'testUpdated',
            categoryId: categoryForUpdate._id
          },
          _id: article._id
        });
      });

      it('article have all keys', async () => {
        expect(updateArticle).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(updateArticle).to.have.property('isDeleted', false);
        expect(updateArticle).to.have.property('title', 'testUpdated');
        expect(updateArticle.createdAt).to.not.equal(article.updatedAt);
        expect(updateArticle.categoryId).to.deep.equal(category._id);
      });
      it('update categoryId', async () => {
        expect(updateCategoryId).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(updateCategoryId).to.have.property('isDeleted', false);
        expect(updateCategoryId).to.have.property('title', 'testUpdated');
        expect(updateCategoryId.createdAt).to.not.equal(article.updatedAt);
        expect(updateCategoryId.categoryId).to.deep.equal(
          categoryForUpdate._id
        );
      });
    });
    describe('category list', () => {
      it('caegory have all keys', async () => {
        const list = await ArticleAction.getCategoryList(article._id);
        expect(list[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v'
        ]);

        expect(list).to.have.lengthOf(1);
      });
    });

    describe('get item', () => {
      it('article have all keys', async () => {
        const ArticleItem = await ArticleAction.getItem(article._id);
        expect(ArticleItem).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(ArticleItem).to.have.property('isDeleted', false);
        expect(ArticleItem).to.have.property('title', 'testUpdated');
        expect(ArticleItem.createdAt).to.not.equal(ArticleItem.updatedAt);
        expect(ArticleItem.categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });

    describe('reipes by category', () => {
      it('Article have all keys', async () => {
        const ArticleArray = await ArticleAction.byCategory(
          categoryForUpdate._id
        );
        expect(ArticleArray[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(ArticleArray[0]).to.have.property('isDeleted', false);
        expect(ArticleArray[0]).to.have.property('title', 'testUpdated');
        expect(ArticleArray[0].createdAt).to.not.equal(
          ArticleArray[0].updatedAt
        );
        expect(ArticleArray[0].categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });

    describe('delete', () => {
      let deleteArticle;
      before(async function() {
        deleteArticle = await ArticleAction.delete(article._id);
      });

      it('Article have all keys', async () => {
        expect(deleteArticle).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'description',
          'categoryId',
          '__v'
        ]);

        expect(deleteArticle).to.have.property('isDeleted', true);
        expect(deleteArticle).to.have.property('title', 'testUpdated');
        expect(deleteArticle.createdAt).to.not.equal(article.updatedAt);
        expect(deleteArticle.categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });
  });
});
