import mongoose from 'mongoose';
import * as _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export let tokenWriteSchema = new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      userId: {type: 'ObjectId', required: true},
      token: { type: String, required: true }
    }));