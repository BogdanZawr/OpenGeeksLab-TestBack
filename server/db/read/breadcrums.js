import { Schema } from 'mongoose';
import * as _ from 'lodash';

import standardField from '../../component/db/dbStandardField';

export default new Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      categoryId: { type: Schema.Types.ObjectId },
      breadCrums: { type: Array, required: true },
      recipeId: { type: Array, required: true },
      articleId: { type: Array, required: true },
    },
  ),
);
