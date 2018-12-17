import * as _ from 'lodash';

import RecipeWrite from '../model/write/recipe';
import CategoryAction from './category';
import { ArticleAction } from './article';
import eventBus from '../component/eventBus';
import BreadcrumsRead from '../model/read/breadcrums';

class RecipeAction extends ArticleAction {
  async create(data) {
    const recipe = await RecipeWrite.create(data);
    eventBus.emit('breadcrumsArticleRecipeUpdate', { data: recipe, type: 'recipe', isDelete: false });
    return recipe;
  }

  async delete(_id) {
    const deleteItem = await this.model.delete(_id);
    eventBus.emit('breadcrumsArticleRecipeUpdate', { data: deleteItem, type: 'recipe', isDelete: true });
    return deleteItem;
  }

  update({ data, _id }) {
    return RecipeWrite.update(data, _id);
  }

  async getCategoryList(recipeId) {
    let item = await BreadcrumsRead.findByRecipeId(recipeId);
    if (item) {
      item = item.breadCrums;
    }
    return item;
  }
}

export default new RecipeAction(RecipeWrite);
