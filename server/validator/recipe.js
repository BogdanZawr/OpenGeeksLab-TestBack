import * as _ from 'lodash';

import recipeWrite from '../model/write/recipe';
import categoryWrite from '../model/write/category';

import validator from '../component/validator';
import { ArticleValidate } from './article';

const categoryFreeData = ['title', 'text', 'categoryId'];

class RecipeValidate extends ArticleValidate {
  async create(body) {
    const validateObj = {
      categoryId: {
        isMongoId: {
          message: 'categoryId is not mongoId',
        },
      },
      title: {
        notEmpty: {
          message: 'Title is required',
        },
      },
      text: {
        notEmpty: {
          message: 'Text required',
        },
      },
    };

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    if (body.categoryId) {
      const categoryObj = await categoryWrite.findById(body.categoryId);

      if (!categoryObj) {
        throw [{ param: 'category', message: 'CategoryId not found' }];
      }
    }

    return _.pick(body, categoryFreeData);
  }

  async update(body) {
    const fullValidateObj = {
      categoryId: {
        isMongoId: {
          message: 'categoryId is not mongoId',
        },
      },
      title: {
        notEmpty: {
          message: 'Title is required',
        },
      },
      text: {
        notEmpty: {
          message: 'Text required',
        },
      },
    };

    const fieldsList = ['categoryId', 'title', 'text'];

    const validateObj = {
      _id: {
        notEmpty: {
          message: '_id is required',
        },
        isMongoId: {
          message: '_id is not mongoId',
        },
      },
    };

    for (const field of fieldsList) {
      if (!_.isUndefined(body[field]) && fullValidateObj[field]) {
        validateObj[field] = fullValidateObj[field];
      }
    }

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    if (body.categoryId) {
      const categoryObj = await categoryWrite.findById(body.categoryId);

      if (!categoryObj) {
        throw [{ param: 'category', message: 'Category not found' }];
      }
    }

    const recipeObj = await recipeWrite.findById(body._id);

    if (!recipeObj) {
      throw [{ param: 'recipe', message: 'Recipe not found' }];
    }

    return {
      data: _.pick(body, categoryFreeData),
      _id: body._id,
    };
  }
}

export default new RecipeValidate(recipeWrite);
