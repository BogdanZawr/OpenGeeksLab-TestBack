import * as _ from 'lodash';
import fs from 'fs';

import articleWrite from '../model/write/article';
import categoryWrite from '../model/write/category';

import validator from '../component/validator';

const categoryFreeData = ['title', 'description', 'text', 'categoryId'];

export class ArticleValidate {
  constructor(model) {
    this.model = model;
  }

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
      description: {
        notEmpty: {
          message: 'Description is required',
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


    const categoryObj = await categoryWrite.findById(body.categoryId);

    if (!categoryObj) {
      throw [{ param: 'category', message: 'CategoryId not found' }];
    }

    return _.pick(body, categoryFreeData);
  }

  async delete(_id) {
    const validateObj = {
      _id: {
        isMongoId: {
          message: 'vaild id is not mongoId',
        },
      },
    };

    const errorList = validator.check({ _id }, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const obj = await this.model.findById(_id);

    if (!obj) {
      throw [{ param: 'delete', message: 'deleted object not found' }];
    }

    return _id;
  }

  async update(body) {
    const fullValidateObj = {
      categoryId: {
        isMongoId: {
          message: 'vaild categoryId is not mongoId',
        },
      },
      title: {
        notEmpty: {
          message: 'Title is required',
        },
      },
      description: {
        notEmpty: {
          message: 'Titleis required',
        },
      },
      text: {
        notEmpty: {
          message: 'Text is required',
        },
      },
    };

    const fieldsList = ['categoryId', 'title', 'description', 'text'];

    const validateObj = {
      _id: {
        notEmpty: {
          message: '_id is required',
        },
        isMongoId: {
          message: '_id is not mongoId'
        }
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

    const articleObj = await this.model.findById(body._id);

    if (!articleObj) {
      throw [{ param: '_id', message: 'obj not found' }];
    }

    return {
      data: _.pick(body, categoryFreeData),
      _id: body._id,
    };
  }

  async categoryList(_id) {
    const validateObj = {
      _id: {
        isMongoId: {
          message: 'vaild _id is not mongoId',
        },
        notEmpty: {
          message: '_id is required',
        },
      },
    };

    const errorList = validator.check({ _id }, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const obj = await this.model.findById(_id);

    if (!obj) {
      throw [{ param: '_id', message: 'obj by _id not found' }];
    }

    return _id;
  }

  async getItem(_id) {
    const validateObj = {
      _id: {
        isMongoId: {
          message: 'vaild id is not mongoId',
        },
        notEmpty: {
          message: '_id is required',
        },
      },
    };

    const errorList = validator.check({ _id }, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const articleObj = await this.model.findById(_id);

    if (!articleObj) {
      throw [{ param: '_id', message: 'obj not found' }];
    }

    return articleObj;
  }

  async byCategory(categoryId) {
    const validateObj = {
      categoryId: {
        isMongoId: {
          message: 'vaild id is not mongoId',
        },
        notEmpty: {
          message: '_id is required',
        },
      },
    };

    const errorList = validator.check({ categoryId }, validateObj);

    if (errorList.length) {
      throw errorList;
    }

    const articleObj = await this.model.findByCategoryId(categoryId);

    if (!articleObj) {
      throw [{ param: 'categoryId', message: 'category not found' }];
    }

    return categoryId;
  }
}

export default new ArticleValidate(articleWrite);
