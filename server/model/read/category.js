import * as _ from 'lodash';

import mongoose from 'mongoose';
import db from '../../component/db';


const categoryRead = db.model('read', 'category');

class CategoryRead {
  findByField(_id) {
    return categoryRead.findRow({
      query: {
        ['childIds.' + _id]: true,
      },
    });
  }

  findAll() {
    return categoryRead.findRows({
      query: {
        isDeleted: false,
      },
    });
  }

  update(data, _id) {
    return categoryRead.updateRow({
      query: {
        _id,
      },
      data,
    });
  }

  create(data) {
    return categoryRead.insertRow({
      data,
    });
  }

  delete(_id) {
    return categoryRead.deleteRow({
      query: {
        _id,
      },
    });
  }

}

export default new CategoryRead();
