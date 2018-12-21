import * as _ from 'lodash';

import mongoose from 'mongoose';
import db from '../../component/db';


const breadcrumsRead = db.model('read', 'breadcrums');

class BreadcrumsRead {
  findById(_id) {
    return breadcrumsRead.findRow({
      query: {
        _id,
      },
    });
  }

  update(data, _id) {
    return breadcrumsRead.updateRow({
      query: {
        _id,
      },
      data,
    });
  }

  create(data) {
    return breadcrumsRead.insertRow({
      data,
    });
  }

  delete(_id) {
    return breadcrumsRead.deleteRow({
      query: {
        _id,
      },
    });
  }

  findByCategoryId(categoryId) {
    return breadcrumsRead.findRow({
      query: {
        _id: categoryId,
      },
    });
  }

  findByArticleId(articleId) {
    return breadcrumsRead.findRow({
      query: {
        articleId: mongoose.Types.ObjectId(articleId),
      },
    });
  }

  findByRecipeId(recipeId) {
    return breadcrumsRead.findRow({
      query: {
        recipeId: mongoose.Types.ObjectId(recipeId),
      },
    });
  }

  findManyByField(_id) {
    return breadcrumsRead.findRows({
      query: {
        _id: { $ne: mongoose.Types.ObjectId(_id) },
        'breadCrums._id': mongoose.Types.ObjectId(_id),
      },
    });
  }
}

export default new BreadcrumsRead();
