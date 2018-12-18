import * as _ from 'lodash';
import { expect } from 'chai';
import CategoryValidate from '../../validator/category';
import { category } from '../init';

import CategoryAction from '../../action/category';

describe('validator', () => {
  describe('category', () => {
    let newCategory;
    before(async function() {
      newCategory = await CategoryAction.create({
        title: 'test',
        categoryId: null
      });
    });

    describe('create', () => {
      before(async function() {});

      it('find parentId', async () => {
        const create = await CategoryValidate.create({
          title: 'test',
          categoryId: newCategory._id
        });
        expect(create).to.have.all.keys(['title', 'categoryId']);

        expect(create).to.have.property('title', 'test');
        expect(create.categoryId).to.deep.equal(newCategory._id);
      });

      it('response have all keys', async () => {
        const create = await CategoryValidate.create({
          title: 'test',
          categoryId: null
        });
        expect(create).to.have.all.keys(['title', 'categoryId']);

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
          admin: true
        });

        expect(create).to.have.all.keys(['title', 'categoryId']);

        expect(create).to.have.property('title', 'test');
        expect(create.categoryId).to.deep.equal(null);
      });

      it('categoryId is mongoId', async () => {
        try {
          await CategoryValidate.create({
            title: 'test',
            categoryId: 'Not the mongoId'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'categoryId');
          expect(err[0]).to.have.property(
            'message',
            'categoryId is not mongoId'
          );
        }
      });

      it('title required', async () => {
        try {
          await CategoryValidate.create({
            categoryId: '5c0f7cfd86ac10184821702f'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'title');
          expect(err[0]).to.have.property('message', 'Title is required');
        }
      });

      it('categoryId is mongoId', async () => {
        try {
          await CategoryValidate.create({
            title: 'test',
            categoryId: '5c0f7cfd86ac10184821702d'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'CategoryId not found');
        }
      });
    });

    describe('delete', () => {
      before(async function() {});

      it('find parentId', async () => {
        const id = await CategoryValidate.delete(newCategory._id);
        expect(id).to.deep.equal(newCategory._id);
      });

      it('response have all keys', async () => {
        const _id = 'this is not mongoId';
        try {
          await CategoryValidate.delete(_id);
        } catch (err) {
          expect(err[0]).to.have.property('param', '_id');
          expect(err[0]).to.have.property(
            'message',
            'categoryId is not mongoId'
          );
        }
      });

      it('category not found', async () => {
        const _id = '5c0f7cfd86ac10184821702d';
        try {
          await CategoryValidate.delete(_id);
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'CategoryId not found');
        }
      });
    });

    describe('update', () => {
      let secondCategory;
      let thirdCaregory;

      before(async function() {
        secondCategory = await CategoryAction.create({
          title: 'test',
          categoryId: newCategory._id
        });
        thirdCaregory = await CategoryAction.create({
          title: 'test',
          categoryId: secondCategory._id
        });
      });

      it('find parent category', async () => {
        const res = await CategoryValidate.update({
          _id: secondCategory._id,
          categoryId: newCategory._id,
          title: 'test'
        });
        expect(res).to.have.all.keys(['data', '_id']);

        expect(res.data).to.have.property('title', 'test');
        expect(res.data.categoryId).to.deep.equal(newCategory._id);
        expect(res._id).to.deep.equal(secondCategory._id);
      });

      it('response have all keys', async () => {
        try {
          await CategoryValidate.update({
            _id: '5c0f7cfd86ac10184821702d',
            categoryId: 'this is not mongoId'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'categoryId');
          expect(err[0]).to.have.property(
            'message',
            'categoryId is not mongoId'
          );
        }
      });

      it('response pick only the right keys', async () => {
        const update = await CategoryValidate.update({
          _id: category._id,
          title: 'test',
          categoryId: null,
          userId: '5c13670c07c52023cd106691',
          updatedAt: '2018-12-14T08:17:19.459Z',
          password: true,
          admin: true
        });
        expect(update).to.have.all.keys(['data', '_id']);

        expect(update.data).to.have.property('title', 'test');
        expect(update.data.categoryId).to.deep.equal(null);
        expect(update._id).to.deep.equal(category._id);
      });

      it('_id is required', async () => {
        try {
          await CategoryValidate.update({
            categoryId: category._id
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', '_id');
          expect(err[0]).to.have.property('message', '_id is required');
        }
      });

      it('make a parent of same category', async () => {
        try {
          await CategoryValidate.update({
            _id: category._id,
            categoryId: category._id
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property(
            'message',
            'You cannot make a parent of the category of the same category'
          );
        }
      });

      it('make a deep parent of same category', async () => {
        try {
          await CategoryValidate.update({
            _id: category._id,
            categoryId: thirdCaregory._id
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property(
            'message',
            'You cannot make a parent of the category of the same category'
          );
        }
      });

      it('find parent id', async () => {
        try {
          await CategoryValidate.update({
            _id: category._id,
            categoryId: '5c0f7cfd86ac10184821702d'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'Parent id not found');
        }
      });
    });

    describe('categoryList', () => {
      before(async function() {});

      it('find parentId', async () => {
        const id = await CategoryValidate.categoryList(newCategory._id);
        expect(id).to.deep.equal(newCategory._id);
      });

      it('response have all keys', async () => {
        const _id = 'this is not mongoId';
        try {
          await CategoryValidate.categoryList(_id);
        } catch (err) {
          expect(err[0]).to.have.property('param', 'categoryId');
          expect(err[0]).to.have.property(
            'message',
            'categoryId is not mongoId'
          );
        }
      });

      it('category not found', async () => {
        const _id = '5c0f7cfd86ac10184821702d';
        try {
          await CategoryValidate.categoryList(_id);
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'Category not found');
        }
      });
    });
  });
});
