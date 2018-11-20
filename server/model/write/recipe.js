import * as _ from 'lodash';

import mongoose from 'mongoose';
import db from '../../component/db';


const recipeWrite = db.model('write', 'recipe');

class RecipeWrite {
  findById(_id) {
    return recipeWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  findByCategoryId(categoryId) {
    return recipeWrite.findRows({
      query: {
        categoryId,
        isDeleted: false,
      },
    });
  }

  findAll() {
    return recipeWrite.findRows({
      query: {
        isDeleted: false,
      },
    });
  }

  create({ title, text, categoryId }) {
    return recipeWrite.insertRow({
      data: {
        title,
        text,
        categoryId,
      },
    });
  }

  update(data, _id) {
    return recipeWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data: _.assignIn(data, { updatedAt: new Date() }),
    });
  }

  delete(_id) {
    return recipeWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data: {
        updatedAt: new Date(),
        isDeleted: true,
      },
    });
  }

  deleteArray(categoryId) {
    return recipeWrite.updateRows({
      query: {
        categoryId,
        isDeleted: false,
      },
      data: {
        updatedAt: new Date(),
        isDeleted: true,
      },
    });
  }
}

export default new RecipeWrite();
