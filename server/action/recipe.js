import * as _ from 'lodash';

import RecipeWrite from '../model/write/recipe';
import CategoryAction from './category';
import { ArticleAction } from './article';

class RecipeAction extends ArticleAction {
  create(data) {
    return RecipeWrite.create(data);
  }

  update({ data, _id }) {
    return RecipeWrite.update(data, _id);
  }

  async getCategoryList(recipeId) {
    const recipe = await RecipeWrite.findById(recipeId);
    const breadCrums = await CategoryAction.getCategoryList(recipe.categoryId);
    return breadCrums;
  }
}

export default new RecipeAction(RecipeWrite);
