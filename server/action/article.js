import * as _ from 'lodash';

import ArticleWrite from '../model/write/article';
import eventBus from '../component/eventBus';
import BreadcrumsRead from '../model/read/breadcrums';

export class ArticleAction {
  constructor(model) {
    this.model = model;
  }

  getItem(_id) {
    return this.model.findById(_id);
  }

  byCategory(categoryId) {
    return this.model.findByCategoryId(categoryId);
  }

  async create(data) {
    const article = await this.model.create(data);
    eventBus.emit('breadcrumsArticleRecipeUpdate', { data: article, type: 'article', isDelete: false });
    return article;
  }

  async delete(_id) {
    const deleteItem = await this.model.delete(_id);
    eventBus.emit('breadcrumsArticleRecipeUpdate', { data: deleteItem, type: 'article', isDelete: true });
    return deleteItem;
  }

  update({ data, _id }) {
    return this.model.update(data, _id);
  }

  async getCategoryList(articleId) {
    const item = await BreadcrumsRead.findByArticleId(articleId);
    return item.breadCrums;
  }
}

export default new ArticleAction(ArticleWrite);
