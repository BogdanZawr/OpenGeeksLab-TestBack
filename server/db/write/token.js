import { Schema } from 'mongoose';
import * as _ from 'lodash';

import standardField from '../../component/db/dbStandardField';

export default new Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      userId: { type: 'ObjectId', required: true },
      token: { type: String, required: true },
      expire: { type: Date, default: Date.now, required: true  }
    }));
