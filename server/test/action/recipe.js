import * as _ from 'lodash';
import { expect } from 'chai';
import categoryAction from '../../action/category';

import ArticleAction from '../../action/article';
import RecipeAction from '../../action/recipe';

describe('action', () => {
  describe('recipe', () => {
    let category;
    let recipe;
    let categoryForUpdate;
    before(async () => {
      category = await categoryAction.create({
        title: 'testCategoryForRecipe',
        categoryId: null,
      });
      categoryForUpdate = await categoryAction.create({
        title: 'testCategoryForRecipe',
        categoryId: null,
      });
      recipe = await RecipeAction.create({
        title: 'test',
        text: 'test',
        categoryId: category._id,
      });
    });
    describe('create', () => {
      before(async () => {});

      it('recipe have all keys', async () => {
        expect(recipe).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(recipe).to.have.property('isDeleted', false);
        expect(recipe).to.have.property('title', 'test');
        expect(recipe.createdAt).to.deep.equal(recipe.updatedAt);
        expect(recipe.categoryId).to.deep.equal(category._id);
      });
    });
    describe('update', () => {
      let updateRecipe;
      let updateCategoryId;
      before(async () => {
        const updatedRecipe = await RecipeAction.update({
          data: { title: 'testUpdated' },
          _id: recipe._id,
        });
        updateRecipe = _.cloneDeep(updatedRecipe);
        updateCategoryId = await RecipeAction.update({
          data: {
            title: 'testUpdated',
            categoryId: categoryForUpdate._id,
          },
          _id: recipe._id,
        });
      });

      it('recipe have all keys', async () => {
        expect(updateRecipe).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(updateRecipe).to.have.property('isDeleted', false);
        expect(updateRecipe).to.have.property('title', 'testUpdated');
        expect(updateRecipe.createdAt).to.not.equal(recipe.updatedAt);
        expect(updateRecipe.categoryId).to.deep.equal(category._id);
      });
      it('update categoryId', async () => {
        expect(updateCategoryId).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(updateCategoryId).to.have.property('isDeleted', false);
        expect(updateCategoryId).to.have.property('title', 'testUpdated');
        expect(updateCategoryId.createdAt).to.not.equal(recipe.updatedAt);
        expect(updateCategoryId.categoryId).to.deep.equal(
          categoryForUpdate._id,
        );
      });
    });
    describe('category list', () => {
      it('caegory have all keys', async () => {
        const list = await RecipeAction.getCategoryList(recipe._id);
        expect(list[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(list).to.have.lengthOf(1);
      });
    });

    describe('get item', () => {
      it('recipe have all keys', async () => {
        const recipeItem = await RecipeAction.getItem(recipe._id);
        expect(recipeItem).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(recipeItem).to.have.property('isDeleted', false);
        expect(recipeItem).to.have.property('title', 'testUpdated');
        expect(recipeItem.createdAt).to.not.equal(recipeItem.updatedAt);
        expect(recipeItem.categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });

    describe('reipes by category', () => {
      it('recipe have all keys', async () => {
        const recipeArray = await RecipeAction.byCategory(
          categoryForUpdate._id,
        );
        expect(recipeArray[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(recipeArray[0]).to.have.property('isDeleted', false);
        expect(recipeArray[0]).to.have.property('title', 'testUpdated');
        expect(recipeArray[0].createdAt).to.not.equal(recipeArray[0].updatedAt);
        expect(recipeArray[0].categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });

    describe('delete', () => {
      let deleteRecipe;
      before(async () => {
        deleteRecipe = await RecipeAction.delete(recipe._id);
      });

      it('recipe have all keys', async () => {
        expect(deleteRecipe).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'text',
          'categoryId',
          '__v',
        ]);

        expect(deleteRecipe).to.have.property('isDeleted', true);
        expect(deleteRecipe).to.have.property('title', 'testUpdated');
        expect(deleteRecipe.createdAt).to.not.equal(recipe.updatedAt);
        expect(deleteRecipe.categoryId).to.deep.equal(categoryForUpdate._id);
      });
    });
  });
});
