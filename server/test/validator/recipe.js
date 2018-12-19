import * as _ from 'lodash';
import { expect } from 'chai';
import RecipeValidate from '../../validator/recipe';
import { category } from '../init';

import RecipeAction from '../../action/recipe';

describe('validator', () => {
  let recipe;

  before(async () => {
    recipe = await RecipeAction.create({
      title: 'test',
      text: 'test',
      categoryId: category._id,
    });
  });

  describe('recipe', () => {
    describe('create', () => {
      it('find parentId', async () => {
        const create = await RecipeValidate.create({
          title: 'test',
          text: 'test',
          categoryId: category._id,
        });
        expect(create).to.have.all.keys(['title', 'categoryId', 'text']);

        expect(create.categoryId).to.deep.equal(category._id);
        expect(create).to.have.property('title', 'test');
        expect(create).to.have.property('text', 'test');
      });

      it('response pick only the right keys', async () => {
        const create = await RecipeValidate.create({
          title: 'test',
          text: 'test',
          categoryId: category._id,
          userId: '5c13670c07c52023cd106691',
          updatedAt: '2018-12-14T08:17:19.459Z',
          password: true,
          admin: true,
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
            categoryId: 'this is not mongoId',
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'categoryId');
          expect(err[0]).to.have.property(
            'message',
            'categoryId is not mongoId',
          );
        }
      });

      it('title is required', async () => {
        try {
          await RecipeValidate.create({
            text: 'test',
            categoryId: category._id,
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
            categoryId: category._id,
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
            categoryId: '5c18e845e7ded506d35e8b34',
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'category');
          expect(err[0]).to.have.property('message', 'CategoryId not found');
        }
      });
    });
  });
  describe('delete', () => {
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
    it('find category by categoryId', async () => {
      const obj = await RecipeValidate.update({
        title: 'test',
        text: 'test',
        categoryId: category._id,
        _id: recipe._id,
      });

      expect(obj.data.categoryId).to.deep.equal(category._id);
    });

    it('find recipe by _id', async () => {
      const obj = await RecipeValidate.update({
        title: 'test',
        text: 'test',
        categoryId: category._id,
        _id: recipe._id,
      });

      expect(obj._id).to.deep.equal(recipe._id);
    });

    it('_id is required', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: category._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', '_id is required');
      }
    });

    it('_id is not mongoId', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          _id: 'not mongoid',
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', '_id is not mongoId');
      }
    });

    it('categoryId is not mongoId', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: 'not the mongoId',
          _id: recipe._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'categoryId is not mongoId');
      }
    });

    it('category not found', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: '5c18e845e7ded506d35e8b34',
          _id: recipe._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'category');
        expect(err[0]).to.have.property('message', 'Category not found');
      }
    });

    it('recipe not found', async () => {
      try {
        await RecipeValidate.update({
          title: 'test',
          text: 'test',
          categoryId: category._id,
          _id: '5c18e845e7ded506d35e8b34',
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'recipe');
        expect(err[0]).to.have.property('message', 'Recipe not found');
      }
    });
  });
  describe('category list', () => {
    it('find recipe by _id', async () => {
      const { _id } = recipe;
      const categoryList = await RecipeValidate.categoryList(_id);
      expect(categoryList).to.deep.equal(recipe._id);
    });

    it('_id not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await RecipeValidate.categoryList(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild _id is not mongoId');
      }
    });


    it('_id is required', async () => {
      try {
        await RecipeValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });
  });

  describe('get item', () => {
    it('find recipe by _id', async () => {
      const { _id } = recipe;
      const item = await RecipeValidate.getItem(_id);

      expect(item).to.have.all.keys([
        '_id',
        'isDeleted',
        'title',
        'text',
        'categoryId',
        'createdAt',
        'updatedAt',
        '__v',
      ]);

      expect(item.categoryId).to.deep.equal(recipe.categoryId);
      expect(item._id).to.deep.equal(recipe._id);
      expect(item).to.have.property('title', 'test');
      expect(item).to.have.property('text', 'test');
    });

    it('recipeId not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await RecipeValidate.categoryList(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild _id is not mongoId');
      }
    });

    it('recipe not found', async () => {
      try {
        await RecipeValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });
  });

  describe('by category', () => {
    it('find category by _id', async () => {
      const { _id } = recipe;
      const categoryList = await RecipeValidate.byCategory(_id);
      expect(categoryList).to.deep.equal(recipe._id);
    });

    it('categoryId not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await RecipeValidate.byCategory(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'vaild id is not mongoId');
      }
    });

    it('categoryId is empty', async () => {
      try {
        await RecipeValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });

    it('category not found', async () => {
      try {
        await RecipeValidate.byCategory('5c18e845e7ded506d35e8b36');
      } catch (err) {
        expect(err[1]).to.have.property('param', 'categoryId');
        expect(err[1]).to.have.property('message', 'category not found');
      }
    });
  });
});
