import * as _ from 'lodash';
import mongoose from 'mongoose';

import categoryWrite from '../model/write/category';
import validator from '../component/validator';

const categoryFreeData = [
  'title',
  'categoryId',
];

class CategoryValidate {
  async create(body) {
    const fullValidateObj = {
      categoryId: {
        isMongoId: {
          message: 'categoryId is not mongoId',
        },
      },
    };

    const validateObj = {
      title: {
        notEmpty: {
          message: 'Titleis required',
        },
      },
    };

    if (body.categoryId !== null) {
      if (!_.isUndefined(body.categoryId) && fullValidateObj.categoryId) {
        validateObj.categoryId = fullValidateObj.categoryId;
      }
    }

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw (errorList);
    }

    if (body.categoryId) {
      const categoryObj = await categoryWrite.findById(body.categoryId);

      if (!categoryObj) {
        throw ([{ param: 'category', message: 'CategoryId not found' }]);
      }
    }
    return _.pick(body, categoryFreeData);
  }

  async delete(_id) {
    const validateObj = {
      _id: {
        isMongoId: {
          message: 'categoryId is not mongoId',
        },
      },
    };

    const errorList = validator.check({ _id }, validateObj);

    if (errorList.length) {
      throw (errorList);
    }

    const categoryObj = await categoryWrite.findById(_id);

    if (!categoryObj) {
      throw ([{ param: 'category', message: 'CategoryId not found' }]);
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
    };

    const validateObj = {
      _id: {
        notEmpty: {
          message: '_id is required',
        },
      },
    };

    if (body.categoryId !== null) {
      if (!_.isUndefined(body.categoryId) && fullValidateObj.categoryId) {
        validateObj.categoryId = fullValidateObj.categoryId;
      }
    }

    const errorList = validator.check(body, validateObj);

    if (errorList.length) {
      throw (errorList);
    }

    if (body.categoryId === body._id) {
      throw ([{ param: 'category', message: 'You cannot make a parent of the category of the same category' }]);
    }

    if (body.categoryId) {
      const category = await categoryWrite.findById(body.categoryId);
      if (!category) {
        throw ([{ param: 'category', message: 'Parent id not found' }]);
      }

      const allCategoryes = await categoryWrite.findAll();
      const categoryesIds = {};

      for (let i = 0; i < allCategoryes.length; i++) {
        categoryesIds[allCategoryes[i]._id] = allCategoryes[i];
      }

      let currentCategory = categoryesIds[body.categoryId];
      while (currentCategory.categoryId) {
        const id = mongoose.Types.ObjectId(body._id);
        const currentId = mongoose.Types.ObjectId(currentCategory.categoryId);

        if (currentId.equals(id)) {
          throw ([{ param: 'category', message: 'You cannot make a parent of a category out of a child of this category' }]);
        }

        currentCategory = categoryesIds[currentCategory.categoryId];
      }
    }

    return {
      data: _.pick(body, categoryFreeData),
      _id: body._id,
    };
  }

  async categoryList(categoryId) {
    const validateObj = {
      categoryId: {
        isMongoId: {
          message: 'categoryId is not mongoId',
        },
      },
    };

    const errorList = validator.check({ categoryId }, validateObj);

    if (errorList.length) {
      throw (errorList);
    }


    const categoryObj = await categoryWrite.findById(categoryId);

    if (!categoryObj) {
      throw ([{ param: 'category', message: 'Category not found' }]);
    }

    return categoryId;
  }
}

export default new CategoryValidate();
