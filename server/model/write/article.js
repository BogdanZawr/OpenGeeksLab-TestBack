import * as _ from 'lodash';

import mongoose from 'mongoose';
import db from '../../component/db';


const articleWrite = db.model('write', 'article');

class ArticleWrite {
  findById(_id) {
    return articleWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  findByCategoryId(categoryId) {
    return articleWrite.findRows({
      query: {
        categoryId,
        isDeleted: false,
      },
    });
  }

  findAll() {
    return articleWrite.findRows({
      query: {
        isDeleted: false,
      },
    });
  }

  create({ title, text, description, categoryId }) {
    return articleWrite.insertRow({
      data: {
        title,
        description,
        text,
        categoryId,
      },
    });
  }

  update(data, _id) {
    return articleWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data: _.assignIn(data, { updatedAt: new Date() }),
    });
  }

  delete(_id) {
    return articleWrite.updateRow({
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
    return articleWrite.updateRows({
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

export default new ArticleWrite();
