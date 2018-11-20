import * as _ from 'lodash';

import mongoose from 'mongoose';
import db from '../../component/db';


const categoryWrite = db.model('write', 'category');

class CategoryWrite {
  findById(_id) {
    return categoryWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  updateByParentId(categoryId, categoryIdToChange) {
    return categoryWrite.updateRows({
      query: {
        categoryId,
        isDeleted: false,
      },
      data: {
        categoryId: categoryIdToChange,
        updatedAt: new Date(),
      },
    });
  }

  findAll() {
    return categoryWrite.findRows({
      query: {
        isDeleted: false,
      },
    });
  }

  create({ title, categoryId = null }) {
    return categoryWrite.insertRow({
      data: {
        title,
        categoryId,
      },
    });
  }

  update(data, _id) {
    return categoryWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data: _.assignIn(data, { updatedAt: new Date() }),
    });
  }

  delete(_id) {
    return categoryWrite.updateRow({
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
}

export default new CategoryWrite();
