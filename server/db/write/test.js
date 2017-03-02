import mongoose from 'mongoose';
import * as _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export let testWriteSchema = new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      name: { type: String, required: true, trim: true }
    }));