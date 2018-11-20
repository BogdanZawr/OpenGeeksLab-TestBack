import { Schema } from 'mongoose';
import * as _ from 'lodash';

import standardField from '../../component/db/dbStandardField';

export default new Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      title: { type: String, required: true },
      categoryId: { type: Schema.Types.ObjectId },
      childIds: { type: Object, required: true },
      children: { type: Array, required: true },
    }));