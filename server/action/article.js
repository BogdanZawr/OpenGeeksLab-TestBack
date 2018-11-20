import * as _ from 'lodash';

import ArticleWrite from '../model/write/article';
import CategoryAction from './category';

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

  create(data) {
    return this.model.create(data);
  }

  delete(_id) {
    return this.model.delete(_id);
  }

  update({ data, _id }) {
    return this.model.update(data, _id);
  }

  async getCategoryList(articleId) {
    const article = await this.model.findById(articleId);
    return CategoryAction.getCategoryList(article.categoryId);
  }
}

export default new ArticleAction(ArticleWrite);
