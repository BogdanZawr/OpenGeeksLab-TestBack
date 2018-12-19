import * as _ from 'lodash';
import { expect } from 'chai';
import ArticleValidate from '../../validator/article';
import { category } from '../init';

import ArticleAction from '../../action/article';

describe('validator', () => {
  let article;

  before(async () => {
    article = await ArticleAction.create({
      title: 'test',
      text: 'test',
      description: 'test',
      categoryId: category._id,
    });
  });

  describe('article', () => {
    describe('create', () => {
      it('find parentId', async () => {
        const create = await ArticleValidate.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });
        expect(create).to.have.all.keys([
          'title',
          'categoryId',
          'text',
          'description',
        ]);

        expect(create.categoryId).to.deep.equal(category._id);
        expect(create).to.have.property('title', 'test');
        expect(create).to.have.property('text', 'test');
        expect(create).to.have.property('description', 'test');
      });

      it('response pick only the right keys', async () => {
        const create = await ArticleValidate.create({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
          userId: '5c13670c07c52023cd106691',
          updatedAt: '2018-12-14T08:17:19.459Z',
          password: true,
          admin: true,
        });

        expect(create).to.have.all.keys([
          'title',
          'text',
          'categoryId',
          'description',
        ]);

        expect(create).to.have.property('title', 'test');
        expect(create).to.have.property('text', 'test');
        expect(create).to.have.property('description', 'test');
        expect(create.categoryId).to.deep.equal(category._id);
      });

      it('categoryId is not mongoId', async () => {
        try {
          await ArticleValidate.create({
            title: 'test',
            text: 'test',
            description: 'test',
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
          await ArticleValidate.create({
            text: 'test',
            description: 'test',
            categoryId: category._id,
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'title');
          expect(err[0]).to.have.property('message', 'Title is required');
        }
      });

      it('text required', async () => {
        try {
          await ArticleValidate.create({
            title: 'test',
            description: 'test',
            categoryId: category._id,
          });
        } catch (err) {
          expect(err[0]).to.have.property('param', 'text');
          expect(err[0]).to.have.property('message', 'Text required');
        }
      });

      it('category by category it not found', async () => {
        try {
          await ArticleValidate.create({
            title: 'test',
            text: 'test',
            description: 'test',
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
      const id = await ArticleValidate.delete(article._id);

      expect(id).to.deep.equal(article._id);
    });

    it('vaild id is not mongoId', async () => {
      try {
        await ArticleValidate.delete('not mongoId');
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild id is not mongoId');
      }
    });

    it('deleted object not found', async () => {
      try {
        await ArticleValidate.delete('5c18e845e7ded506d35e8b34');
      } catch (err) {
        expect(err[0]).to.have.property('param', 'delete');
        expect(err[0]).to.have.property('message', 'deleted object not found');
      }
    });
  });

  describe('update', () => {
    it('find category by categoryId', async () => {
      const obj = await ArticleValidate.update({
        title: 'test',
        text: 'test',
        description: 'test',
        categoryId: category._id,
        _id: article._id,
      });

      expect(obj.data.categoryId).to.deep.equal(category._id);
    });

    it('find article by _id', async () => {
      const obj = await ArticleValidate.update({
        title: 'test',
        text: 'test',
        description: 'test',
        categoryId: category._id,
        _id: article._id,
      });

      expect(obj._id).to.deep.equal(article._id);
    });

    it('_id is required', async () => {
      try {
        await ArticleValidate.update({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', '_id is required');
      }
    });

    it('_id is not mongoId', async () => {
      try {
        await ArticleValidate.update({
          title: 'test',
          text: 'test',
          description: 'test',
          _id: 'not mongoid',
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', '_id is not mongoId');
      }
    });

    it('categoryId is not mongoId', async () => {
      try {
        await ArticleValidate.update({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: 'not the mongoId',
          _id: article._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'vaild categoryId is not mongoId');
      }
    });

    it('category not found', async () => {
      try {
        await ArticleValidate.update({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: '5c18e845e7ded506d35e8b34',
          _id: article._id,
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', 'category');
        expect(err[0]).to.have.property('message', 'Category not found');
      }
    });

    it('article not found', async () => {
      try {
        await ArticleValidate.update({
          title: 'test',
          text: 'test',
          description: 'test',
          categoryId: category._id,
          _id: '5c18e845e7ded506d35e8b34',
        });
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'obj not found');
      }
    });
  });
  describe('category list', () => {
    it('find article by _id', async () => {
      const { _id } = article;
      const categoryList = await ArticleValidate.categoryList(_id);
      expect(categoryList).to.deep.equal(article._id);
    });

    it('_id not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await ArticleValidate.categoryList(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild _id is not mongoId');
      }
    });


    it('_id is required', async () => {
      try {
        await ArticleValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });
  });

  describe('get item', () => {

    it('find article by _id', async () => {
      const { _id } = article;
      const item = await ArticleValidate.getItem(_id);

      expect(item).to.have.all.keys([
        '_id',
        'isDeleted',
        'title',
        'text',
        'description',
        'categoryId',
        'createdAt',
        'updatedAt',
        '__v',
      ]);

      expect(item.categoryId).to.deep.equal(article.categoryId);
      expect(item._id).to.deep.equal(article._id);
      expect(item).to.have.property('title', 'test');
      expect(item).to.have.property('text', 'test');
      expect(item).to.have.property('description', 'test');
    });

    it('_id not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await ArticleValidate.categoryList(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', '_id');
        expect(err[0]).to.have.property('message', 'vaild _id is not mongoId');
      }
    });

    it('article not found', async () => {
      try {
        await ArticleValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });
  });

  describe('by category', () => {
    it('find category by _id', async () => {
      const { _id } = article;
      const categoryList = await ArticleValidate.byCategory(_id);
      expect(categoryList).to.deep.equal(article._id);
    });

    it('categoryId not mongoId', async () => {
      const _id = 'this is not mongoId';
      try {
        await ArticleValidate.byCategory(_id);
      } catch (err) {
        expect(err[0]).to.have.property('param', 'categoryId');
        expect(err[0]).to.have.property('message', 'vaild id is not mongoId');
      }
    });

    it('categoryId is empty', async () => {
      try {
        await ArticleValidate.categoryList();
      } catch (err) {
        expect(err[1]).to.have.property('param', '_id');
        expect(err[1]).to.have.property('message', '_id is required');
      }
    });

    it('category not found', async () => {
      try {
        await ArticleValidate.byCategory('5c18e845e7ded506d35e8b36');
      } catch (err) {
        expect(err[1]).to.have.property('param', 'categoryId');
        expect(err[1]).to.have.property('message', 'category not found');
      }
    });
  });
});
