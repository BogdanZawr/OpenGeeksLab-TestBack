import * as _ from 'lodash';
import { expect } from 'chai';
import RecipeValidate from '../../validator/recipe';
import { category } from '../init';

import RecipeAction from '../../action/recipe';

describe('validator', () => {
  let recipe;

  before(async function() {
    recipe = await RecipeAction.create({
      title: 'test',
      text: 'test',
      categoryId: category._id
    });
  });

  describe('recipe', () => {
    before(async function() {});

    describe('create', () => {
      before(async function() {});

      it('find parentId', async () => {
        const recipe = await RecipeValidate.create({
          title: 'test',
          text: 'test',
          categoryId: category._id
        });
        expect(recipe).to.have.all.keys(['title', 'categoryId', 'text']);

        expect(recipe.categoryId).to.deep.equal(category._id);
        expect(recipe).to.have.property('title', 'test');
        expect(recipe).to.have.property('text', 'test');
      });

      it('response pick only the right keys', async () => {
        const create = await RecipeValidate.create({
          title: 'test',
          text: 'test',
          categoryId: category._id,
          userId: '5c13670c07c52023cd106691',
          updatedAt: '2018-12-14T08:17:19.459Z',
          password: true,
          admin: true
        });

        expect(create).to.have.all.keys(['title', 'text', 'categoryId']);

        expect(create).to.have.property('title', 'test');
        expect(create.categoryId).to.deep.equal(category._id);
      });

      it('categoryId is not mongoId', async () => {
        try {
          await RecipeValidate.create({
            title: 'test',
            text: 'test',
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

      it('title is required', async () => {
        try {
          await RecipeValidate.create({
            text: 'test',
            categoryId: category._id
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'title');
          expect(err[0]).to.have.property('message', 'Title is required');
        }
      });

      it('text required', async () => {
        try {
          await RecipeValidate.create({
            title: 'test',
            categoryId: category._id
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'text');
          expect(err[0]).to.have.property('message', 'Text required');
        }
      });

      it('category by category it not found', async () => {
        try {
          await RecipeValidate.create({
            title: 'test',
            text: 'test',
            categoryId: '5c18e845e7ded506d35e8b34'
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'CategoryId not found');
        }
      });
    });
  });
  describe('delete', () => {
    before(async function() {});

    it('find category by id', async () => {
      const id = await RecipeValidate.delete(recipe._id);

      expect(id).to.deep.equal(recipe._id);
    });

    it('vaild id is not mongoId', async () => {
      try {
        await RecipeValidate.delete('not mongoId');
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild id is not mongoId');
      }
    });

    it('deleted object not found', async () => {
      try {
        await RecipeValidate.delete('5c18e845e7ded506d35e8b34');
      } catch (err) {
        expect(err[0]).to.have.property('param', 'delete');
        expect(err[0]).to.have.property('message', 'deleted object not found');
      }
    });
  });

  describe('update', () => {
    before(async function() {});

    it('find category by categoryId', async () => {
      const obj = await RecipeValidate.update({
        title: 'test',
        text: 'test',
        categoryId: category._id,
        _id: recipe._id
      });

      expect(obj.data.categoryId).to.deep.equal(category._id);
    });

    it('find recipe by _id', async () => {
      const obj = await RecipeValidate.update({
        title: 'test',
        text: 'test',
        categoryId: category._id,
        _id: recipe._id
      });

      expect(obj._id).to.deep.equal(recipe._id);
    });

    it('categoryId is not mongoId', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: 'not the mongoId',
          _id: recipe._id
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'categoryId is not mongoId');
      }
    });

    it('_id is required', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: category._id
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', '_id is required');
      }
    });

    it('categoryId is required', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          _id: recipe._id
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'CategoryId is required');
      }
    });

    it('category not found', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: '5c18e845e7ded506d35e8b34',
          _id: recipe._id
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'category');
        expect(err[0]).to.have.property('message', 'Category not found');
      }
    });
  });
});
