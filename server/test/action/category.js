import * as _ from 'lodash';
import mongoose from 'mongoose';
import { expect } from 'chai';
import categoryAction from '../../action/category';

import { category } from '../init';
import ArticleAction from '../../action/article';
import RecipeAction from '../../action/recipe';

describe('action', () => {
  describe('category', () => {
    let newCategory;
    describe('create', () => {
      it('category have all keys', async () => {
        newCategory = await categoryAction.create({
          title: 'testUpdate',
          categoryId: null,
        });

        expect(newCategory).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(newCategory).to.have.property('isDeleted', false);
        expect(newCategory).to.have.property('categoryId', null);
        expect(newCategory).to.have.property('title', 'testUpdate');
        expect(newCategory.createdAt).to.deep.equal(newCategory.updatedAt);
      });

      it('create parent category', async () => {
        const res = await categoryAction.create({
          title: 'test', categoryId: newCategory._id,
        });

        expect(res).to.have.property('isDeleted', false);
        expect(res).to.have.property('title', 'test');
        expect(res.categoryId).to.deep.equal(newCategory._id);
      });
    });

    describe('update', () => {
      it('category have all keys', async () => {
        const req = await categoryAction.update({
          data: { title: 'testUpdated' },
          _id: newCategory._id,
        });

        expect(req).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(req).to.have.property('isDeleted', false);
        expect(req).to.have.property('title', 'testUpdated');
        expect(req.createdAt).to.not.equal(req.updatedAt);
        expect(req.categoryId).to.deep.equal(null);
        expect(req.createdAt).to.not.equal(req.updatedAt);
      });

      it('change parent id', async () => {
        const req = await categoryAction.update({
          data: { title: 'test', categoryId: category._id },
          _id: newCategory._id,
        });

        expect(req).to.have.property('isDeleted', false);
        expect(req.categoryId).to.deep.equal(category._id);
        expect(req).to.have.property('title', 'test');
        expect(req.createdAt).to.not.equal(req.updatedAt);
      });
    });

    describe('delete', () => {
      let categoryToDelete;
      let parentCategory;

      before(async () => {
        categoryToDelete = await categoryAction.create({
          title: 'testForDelete',
          categoryId: null,
        });
        parentCategory = await categoryAction.create({
          title: 'testForDelete',
          categoryId: categoryToDelete._id,
        });
        await ArticleAction.create({
          title: 'testForDelete',
          text: 'testForDelete',
          description: 'testForDelete',
          categoryId: categoryToDelete._id,
        })
        await RecipeAction.create({
          title: 'testForDelete',
          text: 'testForDelete',
          categoryId: categoryToDelete._id,
        })
      });

      it('delete category', async () => {
        const req = await categoryAction.delete(
          categoryToDelete._id,
        );

        expect(req).to.have.property('isDeleted', true);
        expect(req).to.have.property('title', 'testForDelete');
        expect(req.createdAt).to.not.equal(req.updatedAt);
      });

      it('update child category', async () => {
        const req = await categoryAction.getById(parentCategory._id);

        expect(req).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(req).to.have.property('isDeleted', false);
        expect(req).to.have.property('title', 'testForDelete');
        expect(req.createdAt).to.not.equal(parentCategory.updatedAt);
        expect(req.categoryId).to.deep.equal(null);
      });

      it('delete article', async () => {
        const req = await ArticleAction.byCategory(categoryToDelete._id);
        expect(req).to.be.empty;
      });

      it('delete recipe', async () => {
        const req = await RecipeAction.byCategory(categoryToDelete._id);
        expect(req).to.be.empty;
      });
    });

    describe('get category list', () => {
      before(async () => {
        await categoryAction.buildBreadcrums({
          isDeleted: false,
          _id: '5c1a5411756c7358dd3982a3',
          title: 'test',
          categoryId: null,
          createdAt: '2018-12-19T14:22:09.586Z',
          updatedAt: '2018-12-19T14:22:09.586Z',
          __v: 0,
        });
      });

      it('category have all keys and', async () => {
        const req = await categoryAction.getCategoryList('5c1a5411756c7358dd3982a3');

        expect(req[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(req).to.not.be.empty;
      });
    });

    describe('category full info', () => {
      it('category have all keys', async () => {
        const req = await categoryAction.categoryFullInfo(category._id);

        expect(req[0]).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          '_id',
          'articles',
          'recipes',
          'title',
          'categoryId',
          '__v',
        ]);

        expect(req[0]).to.have.property('isDeleted', false);
        expect(req[0]).to.have.property('title', 'test');
        expect(req[0].categoryId).to.deep.equal(null);
      });
    });
    describe('tree', () => {
      let allTrees;
      let curentTree;
      describe('tree build', () => {
        before(async () => {
          await categoryAction.tree({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'),
            title: 'test',
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
          await categoryAction.tree({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'),
            title: 'test',
            categoryId: mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
          await categoryAction.tree({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0a600adf02f73027379410'),
            title: 'test',
            categoryId: mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
          allTrees = await categoryAction.getAll();
          for (let i = 0; i < allTrees.length; i++) {
            if (allTrees[i]._id == '5c0a285f7b81250da0a914dd') {
              curentTree = allTrees[i];
              break;
            }
          }
        });
        it('create root element', async () => {
          expect(curentTree).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'isDeleted',
            '_id',
            'childIds',
            'children',
            'title',
            'categoryId',
            '__v',
          ]);

          expect(curentTree).to.have.property('isDeleted', false);
          expect(curentTree).to.have.property('title', 'test');
          expect(curentTree.categoryId).to.deep.equal(null);
          expect(curentTree._id).to.deep.equal(mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'));
        });

        it('create child element', async () => {
          const curentelement = curentTree.children[0];
          expect(curentelement).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'isDeleted',
            '_id',
            'childIds',
            'children',
            'title',
            'categoryId',
            '__v',
          ]);

          expect(curentelement).to.have.property('isDeleted', false);
          expect(curentelement).to.have.property('title', 'test');
          expect(curentelement.categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'));
          expect(curentelement._id).to.deep.equal(mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'));
        });

        it('create child of child element', async () => {
          const curentelement = curentTree.children[0].children[0];
          expect(curentelement).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'isDeleted',
            '_id',
            'childIds',
            'children',
            'title',
            'categoryId',
            '__v',
          ]);

          expect(curentelement).to.have.property('isDeleted', false);
          expect(curentelement).to.have.property('title', 'test');
          expect(curentelement.categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'));
          expect(curentelement._id).to.deep.equal(mongoose.Types.ObjectId('5c0a600adf02f73027379410'));
        });
      });
      describe('tree update', () => {
        let treesAfterUpdate;
        before(async () => {
          await categoryAction.treeRebuild({
            category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'),
              title: 'testUpdateTree',
              categoryId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0a4a90930c022186404f5e',
            isDelete: false,
          });
          await categoryAction.treeRebuild({
            category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0a600adf02f73027379410'),
              title: 'testUpdateTree',
              categoryId: mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'),
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0a600adf02f73027379410',
            isDelete: false,
          });
          treesAfterUpdate = await categoryAction.getAll();
        });

        it('update child to null', async () => {
          const index = _.findIndex(treesAfterUpdate, (o) => { return o._id.equals('5c0a4a90930c022186404f5e')});
          const item = treesAfterUpdate[index];
          expect(item).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'isDeleted',
            '_id',
            'childIds',
            'children',
            'title',
            'categoryId',
            '__v',
          ]);

          expect(item).to.have.property('isDeleted', false);
          expect(item).to.have.property('title', 'test');
          expect(item._id).to.deep.equal(mongoose.Types.ObjectId('5c0a4a90930c022186404f5e'));
          expect(item.categoryId).to.deep.equal(null);
          expect(item.children).to.be.empty;
        });

        it('update child to child', async () => {
          const index = _.findIndex(treesAfterUpdate, (o) => { return o._id.equals('5c0a285f7b81250da0a914dd')});
          const indexOfChild = _.findIndex(treesAfterUpdate[index].children, (o) => { return o._id.equals('5c0a600adf02f73027379410')});
          const item = treesAfterUpdate[index].children[indexOfChild];
          expect(item).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'isDeleted',
            '_id',
            'childIds',
            'children',
            'title',
            'categoryId',
            '__v',
          ]);

          expect(item).to.have.property('isDeleted', false);
          expect(item).to.have.property('title', 'test');
          expect(item._id).to.deep.equal(mongoose.Types.ObjectId('5c0a600adf02f73027379410'));
          expect(item.categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0a285f7b81250da0a914dd'));
          expect(item.children).to.be.empty;
        });
      });
    });
    describe('breadcrums', () => {
      describe('create', () => {
        let treesAfterUpdate;
        before(async () => {
          await categoryAction.buildBreadcrums({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'),
            title: 'testBreadcrums',
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
          await categoryAction.buildBreadcrums({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'),
            title: 'testBreadcrums',
            categoryId: mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
          await categoryAction.buildBreadcrums({
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
            title: 'testBreadcrums',
            categoryId: mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          });
        });

        it('create breadcrums ', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));
          const index = _.findIndex(item, (o) => { return o._id.equals('5c0f7cfd86ac10184821702f')});
          expect(item[index]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(item[index]).to.have.property('isDeleted', false);
          expect(item[index]).to.have.property('title', 'testBreadcrums');
          expect(item[index]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));
          expect(item[index].categoryId).to.deep.equal(null);
          expect(item).to.have.lengthOf(1);
        });

        it('create child breadcrums ', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'));
          const index = _.findIndex(item, (o) => { return o._id.equals('5c0f7d0c86ac101848217032')});

          expect(item[index]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(item).to.have.lengthOf(2);
          expect(item[index]).to.have.property('isDeleted', false);
          expect(item[index]).to.have.property('title', 'testBreadcrums');
          expect(item[index]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'));
          expect(item[index].categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));
        });
      });

      describe('update', () => {
        before(async () => {
            await categoryAction.breadCrumsRebuild({
              category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
              title: 'testBreadcrums',
              categoryId: mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'),
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0f7d1286ac101848217035',
            isDelete: false,
            });
            await categoryAction.breadCrumsRebuild({
              category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'),
              title: 'testBreadcrums',
              categoryId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0f7d0c86ac101848217032',
            isDelete: false,
            });
        });

        it('update breadcrums to child ', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7d1286ac101848217035'));
          const index = _.findIndex(item, (o) => { return o._id.equals('5c0f7d1286ac101848217035')});

          expect(item[index]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(item[index]).to.have.property('isDeleted', false);
          expect(item[index]).to.have.property('title', 'testBreadcrums');
          expect(item[index]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7d1286ac101848217035'));
          expect(item[index].categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));

          expect(item[index + 1]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(item[index + 1]).to.have.property('isDeleted', false);
          expect(item[index + 1]).to.have.property('title', 'testBreadcrums');
          expect(item[index + 1]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));
          expect(item[index + 1].categoryId).to.deep.equal(null);

          expect(item).to.have.lengthOf(2);
        });

        it('update breadcrums to root ', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'));
          const index = _.findIndex(item, (o) => { return o._id.equals('5c0f7d0c86ac101848217032')});

          expect(item[index]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(item[index]).to.have.property('isDeleted', false);
          expect(item[index]).to.have.property('title', 'testBreadcrums');
          expect(item[index]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'));
          expect(item[index].categoryId).to.deep.equal(null);

          expect(item).to.have.lengthOf(1);
        });
      });
      describe('articles and recipes', () => {
        before(async () => {
          await categoryAction.breadcrumsArticleRecipeUpdate({
            data: {
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c10fcb3049d7933a811f5b6'),
            title: 'testBreadcrums',
            text: 'testBreadcrums',
            categoryId: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          },
          type: 'recipe',
          isDelete: false,
          });
          await categoryAction.breadcrumsArticleRecipeUpdate({
            data: {
            isDeleted: false,
            _id: mongoose.Types.ObjectId('5c10fca9049d7933a811f5b3'),
            title: 'testBreadcrums',
            text: 'testBreadcrums',
            description: 'testBreadcrums',
            categoryId: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          },
          type: 'article',
          isDelete: false,
          });
        });

        it('add new', async () => {
          const recipeItem = await RecipeAction.getCategoryList(mongoose.Types.ObjectId('5c10fcb3049d7933a811f5b6'));
          const articleItem = await ArticleAction.getCategoryList(mongoose.Types.ObjectId('5c10fca9049d7933a811f5b3'));

          const recipeIndex = _.findIndex(recipeItem, (o) => { return o._id.equals('5c0f7d1286ac101848217035')});
          const articleIndex = _.findIndex(articleItem, (o) => { return o._id.equals('5c0f7d1286ac101848217035')});

          expect(recipeItem[recipeIndex]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);
          expect(articleItem[articleIndex]).to.have.all.keys([
            'createdAt',
            'updatedAt',
            'categoryId',
            '_id',
            'title',
            'isDeleted',
            '__v',
          ]);

          expect(recipeItem[recipeIndex]).to.have.property('isDeleted', false);
          expect(recipeItem[recipeIndex]).to.have.property('title', 'testBreadcrums');
          expect(recipeItem[recipeIndex]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7d1286ac101848217035'));
          expect(recipeItem[recipeIndex].categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));

          expect(articleItem[articleIndex]).to.have.property('isDeleted', false);
          expect(articleItem[articleIndex]).to.have.property('title', 'testBreadcrums');
          expect(articleItem[articleIndex]._id).to.deep.equal(mongoose.Types.ObjectId('5c0f7d1286ac101848217035'));
          expect(articleItem[articleIndex].categoryId).to.deep.equal(mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'));
        });
        it('delete', async () => {
          await categoryAction.breadcrumsArticleRecipeUpdate({
            data: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c10fcb3049d7933a811f5b6'),
              title: 'testBreadcrums',
              text: 'testBreadcrums',
              categoryId: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            type: 'recipe',
            isDelete: true,
          });
          await categoryAction.breadcrumsArticleRecipeUpdate({
            data: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c10fca9049d7933a811f5b3'),
              title: 'testBreadcrums',
              text: 'testBreadcrums',
              description: 'testBreadcrums',
              categoryId: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            type: 'article',
            isDelete: true,
          });

          const recipeItem = await RecipeAction.getCategoryList(mongoose.Types.ObjectId('5c10fcb3049d7933a811f5b6'));
          const articleItem = await ArticleAction.getCategoryList(mongoose.Types.ObjectId('5c10fca9049d7933a811f5b3'));

          expect(recipeItem).to.be.a('null');
          expect(articleItem).to.be.a('null');
        });
      });

      describe('delete', () => {
        before(async () => {
            await categoryAction.breadCrumsRebuild({
              category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0f7d1286ac101848217035'),
              title: 'testBreadcrums',
              categoryId: mongoose.Types.ObjectId('5c0f7cfd86ac10184821702f'),
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0f7d1286ac101848217035',
            isDelete: true,
            });
            await categoryAction.breadCrumsRebuild({
              category: {
              isDeleted: false,
              _id: mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'),
              title: 'testBreadcrums',
              categoryId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              __v: 0,
            },
            _id: '5c0f7d0c86ac101848217032',
            isDelete: true,
            });
        });

        it('delete child', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7d1286ac101848217035'));

          expect(item).to.be.a('null');
        });
        it('delete root', async () => {
          const item = await categoryAction.getCategoryList(mongoose.Types.ObjectId('5c0f7d0c86ac101848217032'));

          expect(item).to.be.a('null');
        });
      });
    });
  });
});
