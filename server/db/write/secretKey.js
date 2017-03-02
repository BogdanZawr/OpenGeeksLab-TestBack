import mongoose from 'mongoose';
import * as _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export let secretKeyWriteSchema = new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      key: { type: String, required: true }
    }));